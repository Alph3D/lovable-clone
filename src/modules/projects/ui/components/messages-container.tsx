import { useSuspenseQuery } from '@tanstack/react-query';

import { useTRPC } from '@/trpc/client';

import { MessageCard } from './message-card';
import { MessageForm } from './message-form';

interface MessagesContainerProps {
	projectId: string;
}

export const MessagesContainer = ({ projectId }: MessagesContainerProps) => {
	const trpc = useTRPC();

	const { data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({ projectId }));

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
				</div>
			</div>

			<div className='relative p-3 pt-1'>
				<MessageForm projectId={projectId} />
			</div>
		</div>
	);
};
