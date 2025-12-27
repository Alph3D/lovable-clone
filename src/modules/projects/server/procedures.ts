import { TRPCError } from '@trpc/server';
import { generateSlug } from 'random-word-slugs';
import { z } from 'zod';

import { CreateProjectSchema } from '@/modules/projects/schemas/create-project-schema';
import { consumeCredits } from '@/modules/usage/lib/usage';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const projectsRouter = createTRPCRouter({
	create: protectedProcedure.input(CreateProjectSchema).mutation(async ({ input, ctx }) => {
		try {
			await consumeCredits();
		} catch (error) {
			if (error instanceof Error) {
				throw new TRPCError({ code: 'BAD_REQUEST', message: error.message || 'Something went wrong!' });
			} else {
				throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: "You've run out of credits!" });
			}
		}

		const { value } = input;
		const { userId } = ctx.auth;

		const project = await db.project.create({
			data: {
				messages: {
					create: {
						content: value,
						role: MessageRole.USER,
						type: MessageType.RESULT,
					},
				},
				name: generateSlug(2, {
					format: 'kebab',
				}),
				userId,
			},
		});

		await inngest.send({
			data: {
				projectId: project.id,
				value: value,
			},
			name: 'code-agent/run',
		});

		return project;
	}),
	getMany: protectedProcedure.query(async ({ ctx }) => {
		const { userId } = ctx.auth;

		const projects = await db.project.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
			where: {
				userId,
			},
		});

		return projects;
	}),
	getOne: protectedProcedure
		.input(
			z.object({
				id: z.uuid().trim().min(1, 'ID is required!'),
			})
		)
		.query(async ({ input, ctx }) => {
			const { id } = input;
			const { userId } = ctx.auth;

			const project = await db.project.findUnique({
				where: {
					id,
					userId,
				},
			});

			if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found!' });

			return project;
		}),
});
