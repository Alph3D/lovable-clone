'use client';

import { startTransition, useEffect, useState } from 'react';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Avoid hydration mismatch
	useEffect(() => {
		startTransition(() => {
			setMounted(true);
		});
	}, []);

	if (!mounted) {
		return (
			<Button size='sm' variant='outline' className='size-9 rounded-full p-0' disabled>
				<div className='size-4' />
			</Button>
		);
	}

	const isDark = resolvedTheme === 'dark';

	const handleToggle = () => {
		setTheme(isDark ? 'light' : 'dark');
	};

	return (
		<Button
			size='icon'
			variant='outline'
			className='rounded-full'
			onClick={handleToggle}
			title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
		>
			{isDark ? <MoonIcon className='size-4 stroke-2' /> : <SunIcon className='size-4 stroke-2' />}
		</Button>
	);
};
