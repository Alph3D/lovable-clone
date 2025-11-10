import { useEffect, useRef } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';

import { MessageRole } from '@/generated/prisma';
import { useTRPC } from '@/trpc/client';

import { MessageCard } from './message-card';
import { MessageForm } from './message-form';

interface MessagesContainerProps {
	projectId: string;
}

export const MessagesContainer = ({ projectId }: MessagesContainerProps) => {
	const trpc = useTRPC();
	const bottomRef = useRef<HTMLDivElement>(null);

	const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({ projectId }));

	useEffect(() => {
		const lastAssistantMessage = messages.findLast((message) => message.role === MessageRole.ASSISTANT);

		if (lastAssistantMessage) {
			// TODO: Set Active Fragment
		}
	}, [messages]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView();
	}, [messages.length]);

	return (
		<div className='flex min-h-0 flex-1 flex-col'>
			<div className='min-h-0 flex-1 overflow-y-auto'>
				<div className='pt-2 pr-1'>
					{messages.map((message) => (
						<MessageCard
							key={message.id}
							content={message.content}
							role={message.role}
							type={message.type}
							fragment={message.fragment}
							createdAt={message.createdAt}
							isActiveFragment={false}
							onFragmentClick={() => {}}
						/>
					))}

					<div ref={bottomRef} />
				</div>
			</div>

			<div className='relative p-3 pt-1'>
				<div className='to-background/90 pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-b from-transparent' />
				<MessageForm projectId={projectId} />
			</div>
		</div>
	);
};
