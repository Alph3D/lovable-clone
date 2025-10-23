import { z } from 'zod';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const messagesRouter = createTRPCRouter({
	create: baseProcedure
		.input(z.object({ value: z.string().trim().min(1, 'Message is required') }))
		.mutation(async ({ input }) => {
			const { value } = input;

			const message = await db.message.create({
				data: {
					content: value,
					role: MessageRole.USER,
					type: MessageType.RESULT,
				},
			});

			await inngest.send({
				data: {
					value: input.value,
				},
				name: 'code-agent/run',
			});

			return message;
		}),
	getMany: baseProcedure.query(async () => {
		const messages = await db.message.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		return messages;
	}),
});
