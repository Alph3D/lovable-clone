import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { env } from '@/env/client';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const absoluteUrl = (path: string): string => {
	const formattedPath = path.trim();
	if (formattedPath.startsWith('http')) return formattedPath;

	let baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

	const vercelUrl = env.NEXT_PUBLIC_VERCEL_URL;
	const vercelEnv = env.NEXT_PUBLIC_VERCEL_ENV;

	if (!!vercelEnv && vercelEnv === 'preview' && !!vercelUrl) baseUrl = `https://${vercelUrl}`;

	return `${baseUrl}${formattedPath.startsWith('/') ? '' : '/'}${formattedPath}`;
};
