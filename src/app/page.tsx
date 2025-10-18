'use client';

import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';

const HomePage = () => {
	const trpc = useTRPC();
	const invoke = useMutation(trpc.invoke.mutationOptions());

	return (
		<div className='mx-auto max-w-7xl p-4'>
			<Button disabled={invoke.isPending} onClick={() => invoke.mutate({ text: 'test@gmail.com' })}>
				Invoke Background Job
			</Button>
			{invoke.isPending && <div>Invoking...</div>}
			{invoke.isSuccess && <div>Invoked successfully</div>}
			{invoke.isError && <div>Error: {invoke.error.message}</div>}
		</div>
	);
};

export default HomePage;
