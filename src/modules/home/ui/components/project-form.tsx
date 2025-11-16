'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import { z } from 'zod';

import { PROJECT_TEMPLATES } from '@/modules/home/constants';
import { CreateProjectSchema } from '@/modules/projects/schemas/create-project-schema';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

export const ProjectForm = () => {
	const router = useRouter();

	const [isFocused, setIsFocused] = useState(false);

	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const form = useForm<z.infer<typeof CreateProjectSchema>>({
		defaultValues: {
			value: '',
		},
		resolver: zodResolver(CreateProjectSchema),
	});

	const createProject = useMutation(
		trpc.projects.create.mutationOptions({
			onError: (error) => {
				// TODO: Redirect to pricing page if specific error (potentially PAYMENT_REQUIRED)
				toast.error(error.message || 'Failed to create project!');
			},
			onSuccess: ({ id }) => {
				queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
				// TODO: Invalidate usage status

				router.push(`/projects/${id}`);
			},
		})
	);

	const onSubmit = async (values: z.infer<typeof CreateProjectSchema>) => {
		await createProject.mutateAsync({
			value: values.value,
		});
	};

	const onSelect = (content: string) => {
		form.setValue('value', content, {
			shouldDirty: true,
			shouldTouch: true,
			shouldValidate: true,
		});
	};

	const isPending = createProject.isPending;
	const isDisabled = isPending || !form.formState.isValid;

	return (
		<Form {...form}>
			<section className='space-y-6'>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className={cn(
						'bg-sidebar dark:bg-sidebar relative rounded-xl border p-4 pt-1 transition-all',
						isFocused && 'shadow-xs'
					)}
				>
					<FormField
						control={form.control}
						name='value'
						render={({ field }) => (
							<TextareaAutosize
								{...field}
								disabled={isPending}
								onFocus={() => setIsFocused(true)}
								onBlur={() => setIsFocused(false)}
								minRows={2}
								maxRows={8}
								className='w-full resize-none border-none bg-transparent pt-4 outline-none'
								placeholder='What would you like to build?'
								onKeyDown={(e) => {
									if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
										e.preventDefault();
										form.handleSubmit(onSubmit)(e);
									}
								}}
							/>
						)}
					/>

					<div className='flex items-end justify-between gap-x-2 pt-2'>
						<div className='text-muted-foreground font-mono text-[10px]'>
							<kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none'>
								<span>&#8984;</span>Enter
							</kbd>
							&nbsp;to submit
						</div>

						<Button
							disabled={isDisabled}
							isLoading={isPending}
							className={cn('size-8 rounded-full', isDisabled && 'bg-muted-foreground border')}
						>
							{!isPending && <ArrowUpIcon className='size-4' />}
						</Button>
					</div>
				</form>

				<div className='hidden max-w-3xl flex-wrap justify-center gap-2 md:flex'>
					{PROJECT_TEMPLATES.map((template) => (
						<Button
							key={template.title}
							variant='outline'
							size='sm'
							className='dark:bg-sidebar bg-white'
							onClick={() => onSelect(template.prompt)}
						>
							{template.emoji} {template.title}
						</Button>
					))}
				</div>
			</section>
		</Form>
	);
};
