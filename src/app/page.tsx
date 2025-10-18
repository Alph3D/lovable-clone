'use client';

import { useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';

const HomePage = () => {
	const [value, setValue] = useState('');
	const trpc = useTRPC();
	const invoke = useMutation(trpc.invoke.mutationOptions());

	return (
		<div className='mx-auto max-w-7xl p-4'>
			<div className='flex flex-col gap-2'>
				<Input placeholder='Enter value' value={value} onChange={(e) => setValue(e.target.value)} />

				<Button disabled={invoke.isPending} onClick={() => invoke.mutate({ value })}>
					Invoke Background Job
				</Button>
				{invoke.isPending && <div>Invoking...</div>}
				{invoke.isSuccess && <div>Invoked successfully</div>}
				{invoke.isError && <div>Error: {invoke.error.message}</div>}
			</div>
		</div>
	);
};

export default HomePage;
