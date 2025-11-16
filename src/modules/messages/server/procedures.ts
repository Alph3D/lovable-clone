import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { CreateMessageSchema } from '@/modules/messages/schemas/create-message-schema';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const messagesRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			CreateMessageSchema.extend({
				projectId: z.uuid().trim().min(1, 'Project ID is required!'),
			})
		)
		.mutation(async ({ input, ctx }) => {
			const { projectId, value } = input;
			const { userId } = ctx.auth;

			const existingProjectCount = await db.project.count({
				where: {
					id: projectId,
					userId,
				},
			});

			if (existingProjectCount === 0) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found!' });

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
	getMany: protectedProcedure
		.input(
			z.object({
				projectId: z.uuid().trim().min(1, 'Project ID is required!'),
			})
		)
		.query(async ({ input, ctx }) => {
			const { projectId } = input;
			const { userId } = ctx.auth;

			const messages = await db.message.findMany({
				include: {
					fragment: true,
				},
				orderBy: {
					updatedAt: 'asc',
				},
				where: {
					project: {
						userId,
					},
					projectId,
				},
			});

			return messages;
		}),
});
