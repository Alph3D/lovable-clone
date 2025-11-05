import { z } from 'zod';

import { MAX_MESSAGE_LENGTH, MIN_MESSAGE_LENGTH } from '@/modules/messages/config';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const messagesRouter = createTRPCRouter({
	create: baseProcedure
		.input(
			z.object({
				projectId: z.uuid().trim().min(1, 'Project ID is required!'),
				value: z
					.string()
					.trim()
					.min(MIN_MESSAGE_LENGTH, 'Value is required!')
					.max(MAX_MESSAGE_LENGTH, 'Value is too long!'),
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
