import { Sandbox } from '@e2b/code-interpreter';
import { createAgent, openai } from '@inngest/agent-kit';

import { env } from '@/env/server';

import { inngest } from './client';
import { getSandbox } from './utils';

export const helloWorld = inngest.createFunction(
	{ id: 'hello-world' },
	{ event: 'test/hello.world' },
	async ({ event, step }) => {
		const sandboxId = await step.run('get-sandbox-id', async () => {
			const sandbox = await Sandbox.create('vibe-nextjs-test-xxxx');

			return sandbox.sandboxId;
		});

		await step.sleep('wait-a-moment', '5s');

		const codeAgent = createAgent({
			model: openai({ apiKey: env.OPENAI_API_KEY, model: 'gpt-4o' }),
			name: 'code-agent',
			system:
				'You are an expert Next.js developer.  You write readable, maintainable code. You write simple Next.js & React snippets.',
		});

		const { output } = await codeAgent.run(`Write the following snippet: ${event.data.value}`);

		const sandboxUrl = await step.run('get-sandbox-url', async () => {
			const sandbox = await getSandbox(sandboxId);

			const host = sandbox.getHost(3000);

			return `https://${host}`;
		});

		return { output, sandboxUrl };
	}
);
