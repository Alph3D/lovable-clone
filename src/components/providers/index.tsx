import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/client';

export const Providers = ({ children }: Readonly<PropsWithChildren>) => {
	return <TRPCReactProvider>{children}</TRPCReactProvider>;
};
