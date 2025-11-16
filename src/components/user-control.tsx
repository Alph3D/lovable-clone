'use client';

import { UserButton } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';

interface UserControlProps {
	showName?: boolean;
}

export const UserControl = ({ showName = false }: UserControlProps) => {
	const { resolvedTheme } = useTheme();

	return (
		<UserButton
			showName={showName}
			appearance={{
				captcha: {
					theme: resolvedTheme === 'dark' ? 'dark' : 'light',
				},
				elements: {
					userButtonAvatarBox: 'size-8!',
					userButtonBox: 'rounded-md!',
					userButtonTrigger: 'rounded-md!',
				},
				theme: resolvedTheme === 'dark' ? dark : undefined,
			}}
			userProfileProps={{
				appearance: {
					captcha: {
						theme: resolvedTheme === 'dark' ? 'dark' : 'light',
					},
					theme: resolvedTheme === 'dark' ? dark : undefined,
				},
			}}
		/>
	);
};
