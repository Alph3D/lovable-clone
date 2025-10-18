import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.url().trim(),
		NEXT_PUBLIC_VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
		NEXT_PUBLIC_VERCEL_URL: z.string().trim().endsWith('.vercel.app').optional(),
	},
	emptyStringAsUndefined: true,
	isServer: typeof window === 'undefined',
	onInvalidAccess: (variable: string) => {
		console.error('❌ Attempted to access a server-side environment variable on the client: ', variable);
		throw new Error('❌ Attempted to access a server-side environment variable on the client');
	},
	onValidationError: (issues) => {
		console.error('❌ Invalid environment variables:', issues);

		throw new Error('❌ Invalid environment variables');
	},
	runtimeEnv: {
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
		NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
	},
});
