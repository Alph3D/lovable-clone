import type { PropsWithChildren } from 'react';

import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from 'next-themes';

import { TRPCReactProvider } from '@/trpc/client';

import { ToasterProvider } from './toaster-provider';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<ClerkProvider>
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
		</ClerkProvider>
	);
};
