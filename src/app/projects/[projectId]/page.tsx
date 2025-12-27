import { Suspense } from 'react';

import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import { ProjectView } from '@/modules/projects/ui/views/project-view';

import { getQueryClient, trpc } from '@/trpc/server';

interface ProjectIdPageProps {
	params: Promise<{
		projectId: string;
	}>;
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
	const { projectId } = await params;

	const queryClient = getQueryClient();

	void queryClient.prefetchQuery(
		trpc.messages.getMany.queryOptions({
			projectId,
		})
	);
	void queryClient.prefetchQuery(
		trpc.projects.getOne.queryOptions({
			id: projectId,
		})
	);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<ErrorBoundary fallback={<p>Error</p>}>
				<Suspense fallback={<p>Loading...</p>}>
					<ProjectView projectId={projectId} />
				</Suspense>
			</ErrorBoundary>
		</HydrationBoundary>
	);
};

export default ProjectIdPage;
