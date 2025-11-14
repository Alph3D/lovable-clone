'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';

import { CodeIcon, CrownIcon, EyeIcon } from 'lucide-react';

import { FragmentWeb } from '@/modules/projects/ui/components/fragment-web';
import { MessagesContainer } from '@/modules/projects/ui/components/messages-container';
import { ProjectHeader } from '@/modules/projects/ui/components/project-header';

import { CodeView } from '@/components/code-view';
import { Button } from '@/components/ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Fragment } from '@/generated/prisma';

interface ProjectViewProps {
	projectId: string;
}

export const ProjectView = ({ projectId }: ProjectViewProps) => {
	const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
	const [tabState, setTabState] = useState<'preview' | 'code'>('preview');

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
					{!!activeFragment && (
						<Tabs
							className='h-full gap-y-0'
							defaultValue='preview'
							value={tabState}
							onValueChange={(value) => setTabState(value as 'preview' | 'code')}
						>
							<div className='flex w-full items-center gap-x-2 border-b p-2'>
								<TabsList className='h-8 rounded-md border p-0'>
									<TabsTrigger value='preview' className='rounded-md'>
										<EyeIcon />
										<span>Demo</span>
									</TabsTrigger>

									<TabsTrigger value='code' className='rounded-md'>
										<CodeIcon />
										<span>Code</span>
									</TabsTrigger>
								</TabsList>

								<div className='ml-auto flex items-center gap-x-2'>
									<Button size='sm' asChild>
										<Link href='/pricing'>
											<CrownIcon /> Upgrade
										</Link>
									</Button>
								</div>
							</div>

							<TabsContent value='preview'>
								<FragmentWeb data={activeFragment} />
							</TabsContent>

							<TabsContent value='code'>
								<CodeView lang='ts' code={`const a = 'Hello, world!';`} />
							</TabsContent>
						</Tabs>
					)}
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
};
