'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTRPC } from '@/trpc/client';

const HomePage = () => {
	const [value, setValue] = useState('');
	const trpc = useTRPC();
	const router = useRouter();

	const createProject = useMutation(
		trpc.projects.create.mutationOptions({
			onError: (error) => {
				toast.error(error.message);
			},
			onSuccess: ({ id }) => router.push(`/projects/${id}`),
		})
	);

	return (
		<div className='mx-auto max-w-7xl p-4'>
			<div className='flex flex-col gap-2'>
				<Input placeholder='Enter value' value={value} onChange={(e) => setValue(e.target.value)} />

				<Button disabled={createProject.isPending} onClick={() => createProject.mutate({ value })}>
					Submit
				</Button>
				{createProject.isPending && <div>Invoking...</div>}
				{createProject.isSuccess && <div>Invoked successfully</div>}
				{createProject.isError && <div>Error: {createProject.error.message}</div>}
			</div>
		</div>
	);
};

export default HomePage;
