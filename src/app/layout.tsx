import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { cn } from '@/lib/utils';

import './globals.css';

import { Providers } from '@/components/providers';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	description: 'Lovable Clone',
	title: 'Lovable Clone',
};

const RootLayout = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={cn(inter.className, 'antialiased')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
};

export default RootLayout;
