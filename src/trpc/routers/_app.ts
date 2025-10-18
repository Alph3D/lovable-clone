import { z } from 'zod';

import { inngest } from '@/inngest/client';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const appRouter = createTRPCRouter({
	hello: baseProcedure
		.input(
			z.object({
				text: z.string(),
			})
		)
		.query((opts) => {
			return {
				greeting: `hello ${opts.input.text}`,
			};
		}),
	invoke: baseProcedure.input(z.object({ value: z.string() })).mutation(async ({ input }) => {
		await inngest.send({
			data: {
				value: input.value,
			},
			name: 'test/hello.world',
		});
	}),
});

export type AppRouter = typeof appRouter;
