import { z } from 'zod';

import { CreateMessageSchema } from '@/modules/messages/schemas/create-message-schema';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const messagesRouter = createTRPCRouter({
	create: baseProcedure
		.input(
			CreateMessageSchema.extend({
				projectId: z.uuid().trim().min(1, 'Project ID is required!'),
			})
		)
		.mutation(async ({ input }) => {
			const { projectId, value } = input;

			const message = await db.message.create({
				data: {
					content: value,
					projectId,
					role: MessageRole.USER,
					type: MessageType.RESULT,
				},
			});

			await inngest.send({
				data: {
					projectId,
					value,
				},
				name: 'code-agent/run',
			});

			return message;
		}),
	getMany: baseProcedure
		.input(
			z.object({
				projectId: z.uuid().trim().min(1, 'Project ID is required!'),
			})
		)
		.query(async ({ input }) => {
			const { projectId } = input;

			const messages = await db.message.findMany({
				include: {
					fragment: true,
				},
				orderBy: {
					updatedAt: 'asc',
				},
				where: {
					projectId,
				},
			});

			return messages;
		}),
});
