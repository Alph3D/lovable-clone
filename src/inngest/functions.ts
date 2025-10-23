import { Sandbox } from '@e2b/code-interpreter';
import { createAgent, createNetwork, createTool, openai } from '@inngest/agent-kit';
import { z } from 'zod';

import { PROMPT } from '@/config';
import { env } from '@/env/server';

import { inngest } from './client';
import { getLastAssistantTextMessageContent, getSandbox } from './utils';

export const helloWorld = inngest.createFunction(
	{ id: 'hello-world' },
	{ event: 'test/hello.world' },
	async ({ event, step }) => {
		const sandboxId = await step.run('get-sandbox-id', async () => {
			const sandbox = await Sandbox.create('vibe-nextjs-test-9900');

			return sandbox.sandboxId;
		});

		await step.sleep('wait-a-moment', '5s');

		const codeAgent = createAgent({
			description: 'An expert coding agent',
			lifecycle: {
				onResponse: async ({ network, result }) => {
					const lastAssistantTextMessage = getLastAssistantTextMessageContent(result);

					if (lastAssistantTextMessage && lastAssistantTextMessage.includes('<task_summary>') && network)
						network.state.data.summary = lastAssistantTextMessage;

					return result;
				},
			},
			model: openai({ apiKey: env.OPENAI_API_KEY, defaultParameters: { temperature: 0.1 }, model: 'gpt-4.1' }),
			name: 'code-agent',
			system: PROMPT,
			tools: [
				createTool({
					description: 'Use the terminal to run commands',
					handler: async ({ command }, { step }) => {
						return await step?.run('terminal', async () => {
							const buffers = { stderr: '', stdout: '' };

							try {
								const sandbox = await getSandbox(sandboxId);
								const result = await sandbox.commands.run(command, {
									onStderr: (data: string) => {
										buffers.stderr += data;
									},
									onStdout: (data: string) => {
										buffers.stdout += data;
									},
								});

								return result.stdout;
							} catch (err) {
								console.error(`Command failed: ${err} \nstdout: ${buffers.stdout} \nstderror: ${buffers.stderr}`);

								return `Command failed: ${err} \nstdout: ${buffers.stdout} \nstderror: ${buffers.stderr}`;
							}
						});
					},
					name: 'terminal',
					parameters: z.object({
						command: z.string(),
					}),
				}),
				createTool({
					description: 'Create or update files in the sandbox',
					handler: async ({ files }, { network, step }) => {
						const newFiles = await step?.run('create-or-update-files', async () => {
							try {
								const updatedFiles = (await network.state.data.files) || {};
								const sandbox = await getSandbox(sandboxId);

								for (const file of files) {
									await sandbox.files.write(file.path, file.content);
									updatedFiles[file.path] = file.content;
								}

								return updatedFiles;
							} catch (err) {
								console.error('Error creating or updating files: ' + err);

								return 'Error: ' + err;
							}
						});

						if (typeof newFiles === 'object') network.state.data.files = newFiles;
					},
					name: 'createOrUpdateFiles',
					parameters: z.object({
						files: z.array(
							z.object({
								content: z.string(),
								path: z.string(),
							})
						),
					}),
				}),
				createTool({
					description: 'Read files from the sandbox',
					handler: async ({ files }, { step }) => {
						return await step?.run('read-files', async () => {
							try {
								const sandbox = await getSandbox(sandboxId);
								const contents: { content: string; path: string }[] = [];

								for (const file of files) {
									const content = await sandbox.files.read(file);

									contents.push({ content, path: file });
								}

								return JSON.stringify(contents);
							} catch (err) {
								console.error('Error reading files: ' + err);

								return 'Error: ' + err;
							}
						});
					},
					name: 'readFiles',
					parameters: z.object({
						files: z.array(z.string()),
					}),
				}),
			],
		});

		const network = createNetwork({
			agents: [codeAgent],
			maxIter: 15,
			name: 'code-agent-network',
			router: async ({ network }) => {
				const summary = network.state.data.summary;

				if (summary) return;

				return codeAgent;
			},
		});

		const result = await network.run(event.data.value);

		const sandboxUrl = await step.run('get-sandbox-url', async () => {
			const sandbox = await getSandbox(sandboxId);

			const host = sandbox.getHost(3000);

			return `https://${host}`;
		});

		return {
			files: result.state.data.files,
			summary: result.state.data.summary,
			title: 'Fragment',
			url: sandboxUrl,
		};
	}
);
