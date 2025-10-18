import { createAgent, openai } from '@inngest/agent-kit';

import { env } from '@/env/server';

import { inngest } from './client';

export const helloWorld = inngest.createFunction(
	{ id: 'hello-world' },
	{ event: 'test/hello.world' },
	async ({ event, step }) => {
		await step.sleep('wait-a-moment', '5s');

		const summarizer = createAgent({
			model: openai({ apiKey: env.OPENAI_API_KEY, model: 'gpt-4o' }),
			name: 'summarizer',
			system: 'You are an expert summarizer.  You summarize in 3 words or less.',
		});

		const { output } = await summarizer.run(`Summarize the following text: ${event.data.value}`);

		return { output };
	}
);
