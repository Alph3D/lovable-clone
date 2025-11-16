import { TRPCError } from '@trpc/server';
import { generateSlug } from 'random-word-slugs';
import { z } from 'zod';

import { CreateProjectSchema } from '@/modules/projects/schemas/create-project-schema';

import { MessageRole, MessageType } from '@/generated/prisma';
import { inngest } from '@/inngest/client';
import { db } from '@/lib/db';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const projectsRouter = createTRPCRouter({
	create: baseProcedure.input(CreateProjectSchema).mutation(async ({ input }) => {
		const { value } = input;

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
	getMany: baseProcedure.query(async () => {
		const projects = await db.project.findMany({
			orderBy: {
				updatedAt: 'desc',
			},
		});

		return projects;
	}),
	getOne: baseProcedure
		.input(
			z.object({
				id: z.uuid().trim().min(1, 'ID is required!'),
			})
		)
		.query(async ({ input }) => {
			const { id } = input;

			const project = await db.project.findUnique({
				where: {
					id,
				},
			});

			if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found!' });

			return project;
		}),
});
