'use client';

import { useState } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';

const HomePage = () => {
	const [value, setValue] = useState('');
	const trpc = useTRPC();

	const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());

	const createMessage = useMutation(
		trpc.messages.create.mutationOptions({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: () => {
				toast.success('Message created successfully');
			},
		})
	);

	return (
		<div className='mx-auto max-w-7xl p-4'>
			<div className='flex flex-col gap-2'>
				<Input placeholder='Enter value' value={value} onChange={(e) => setValue(e.target.value)} />

				<Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value })}>
					Invoke Background Job
				</Button>
				{createMessage.isPending && <div>Invoking...</div>}
				{createMessage.isSuccess && <div>Invoked successfully</div>}
				{createMessage.isError && <div>Error: {createMessage.error.message}</div>}

				<pre>{JSON.stringify(messages, null, 2)}</pre>
			</div>
		</div>
	);
};

export default HomePage;
