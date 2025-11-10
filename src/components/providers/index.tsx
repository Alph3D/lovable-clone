import type { PropsWithChildren } from 'react';

import { ThemeProvider } from 'next-themes';

import { TRPCReactProvider } from '@/trpc/client';

import { ToasterProvider } from './toaster-provider';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<TRPCReactProvider>
			<ThemeProvider
				attribute='class'
				storageKey='vibe-theme'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				{children}

				<ToasterProvider />
			</ThemeProvider>
		</TRPCReactProvider>
	);
};
