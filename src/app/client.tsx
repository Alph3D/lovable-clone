'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';

export const Client = () => {
	const trpc = useTRPC();

	const { data } = useSuspenseQuery(trpc.hello.queryOptions({ text: 'test' }));

	return (
		<div>
			<h1 className='text-4xl font-bold'>Home Page</h1>

			<Button variant='destructive' size='lg'>
				Click me
			</Button>

			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
};
