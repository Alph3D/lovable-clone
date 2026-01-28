'use client';

import Link from 'next/link';

import { useSuspenseQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';

interface ProjectHeaderProps {
	projectId: string;
}

export const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
	const trpc = useTRPC();

	const { data: project } = useSuspenseQuery(trpc.projects.getOne.queryOptions({ id: projectId }));

	return (
		<header className='bg-sidebar/50 flex items-center justify-between border-b px-3 py-2.5 transition-colors'>
			<div className='flex items-center gap-1'>
				<Button variant='ghost' size='icon-sm' className='shrink-0 p-0' asChild>
					<Link href='/' className='flex items-center justify-center'>
						<ChevronLeftIcon className='size-5' strokeWidth={2.5} />
						<span className='sr-only'>Back to Dashboard</span>
					</Link>
				</Button>

				<div className='flex items-center gap-2.5'>
					<div className='bg-background flex size-8 shrink-0 items-center justify-center rounded-md border'>
						<img src='/logo.svg' alt='Vibe logo' width={16} height={16} className='shrink-0' />
					</div>
					<div className='flex min-w-0 flex-col'>
						<span className='truncate text-sm leading-tight font-semibold'>{project.name}</span>
						<span className='text-muted-foreground text-xs leading-tight'>
							{formatDistanceToNow(project.createdAt, { addSuffix: true })}
						</span>
					</div>
				</div>
			</div>
		</header>
	);
};
