import Link from 'next/link';

import { useAuth } from '@clerk/nextjs';
import { formatDuration, intervalToDuration } from 'date-fns';
import { CrownIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface UsageProps {
	points: number;
	msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: UsageProps) => {
	const { has } = useAuth();

	const hasProAccess = has?.({ plan: 'pro' }) || false;
	const now = new Date();

	return (
		<div className='bg-background rounded-t-xl border border-b-0 p-2.5'>
			<div className='flex items-center gap-x-2'>
				<div className=''>
					<p className='text-sm'>
						{points} {hasProAccess ? '' : 'free'} credits remaining
					</p>

					<p className='text-muted-foreground text-xs'>
						Resets in{' '}
						{formatDuration(
							intervalToDuration({
								end: new Date(now.getTime() + msBeforeNext),
								start: now,
							}),
							{
								format: ['months', 'days', 'hours'],
							}
						)}
					</p>
				</div>

				{!hasProAccess && (
					<Button size='sm' variant='tertiary' className='ml-auto' asChild>
						<Link href='/pricing'>
							<CrownIcon /> Upgrade
						</Link>
					</Button>
				)}
			</div>
		</div>
	);
};
