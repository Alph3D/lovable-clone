'use client';

import { Suspense, useState } from 'react';

import { MessagesContainer } from '@/modules/projects/ui/components/messages-container';
import { ProjectHeader } from '@/modules/projects/ui/components/project-header';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import type { Fragment } from '@/generated/prisma';

interface ProjectViewProps {
	projectId: string;
}

export const ProjectView = ({ projectId }: ProjectViewProps) => {
	const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);

	return (
		<div className='h-screen'>
			<ResizablePanelGroup direction='horizontal'>
				<ResizablePanel defaultSize={35} minSize={20} className='flex min-h-0 flex-col'>
					<Suspense fallback={<p>Loading project...</p>}>
						<ProjectHeader projectId={projectId} />
					</Suspense>

					<Suspense fallback={<p>Loading messages...</p>}>
						<MessagesContainer
							projectId={projectId}
							activeFragment={activeFragment}
							setActiveFragment={setActiveFragment}
						/>
					</Suspense>
				</ResizablePanel>

				<ResizableHandle withHandle />

				<ResizablePanel defaultSize={65} minSize={50}>
					TODO: Preview
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};
