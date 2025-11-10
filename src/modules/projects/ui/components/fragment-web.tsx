import { useState } from 'react';

import { ClipboardCheckIcon, ExternalLinkIcon, RefreshCcwIcon } from 'lucide-react';

import { Hint } from '@/components/hint';
import { Button } from '@/components/ui/button';
import type { Fragment } from '@/generated/prisma';
import { cn } from '@/lib/utils';

interface FragmentWebProps {
	data: Fragment;
}

export const FragmentWeb = ({ data }: FragmentWebProps) => {
	const [copied, setCopied] = useState(false);
	const [fragmentKey, setFragmentKey] = useState(0);
	const [isFrameLoading, setIsFrameLoading] = useState(true);

	const handleRefresh = () => {
		setIsFrameLoading(true);
		setFragmentKey((prev) => prev + 1);
	};

	const handleCopy = () => {
		navigator.clipboard.writeText(data.sandboxUrl);
		setCopied(true);

		setTimeout(() => setCopied(false), 2000); // 2 seconds
	};

	return (
		<div className='flex size-full flex-col'>
			<div className='bg-sidebar flex items-center gap-x-2 border-b p-2'>
				<Hint text='Refresh' side='right' align='start'>
					<Button size='sm' variant='outline' disabled={!data.sandboxUrl || isFrameLoading} onClick={handleRefresh}>
						<RefreshCcwIcon className={cn(isFrameLoading && 'animate-spin')} />
					</Button>
				</Hint>

				<Hint text='Click to copy' side='bottom'>
					<Button
						size='sm'
						variant='outline'
						disabled={!data.sandboxUrl || copied || isFrameLoading}
						onClick={handleCopy}
						className={cn('flex-1 justify-start text-start font-normal', !!data.sandboxUrl && 'disabled:opacity-100')}
					>
						{copied ? (
							<span className='flex items-center gap-x-1 text-emerald-500'>
								<ClipboardCheckIcon className='size-4' />
								<span>Copied to clipboard</span>
							</span>
						) : (
							<span className='truncate'>{data.sandboxUrl}</span>
						)}
					</Button>
				</Hint>

				<Hint text='Open in a new tab' side='left' align='start'>
					<Button
						size='sm'
						variant='outline'
						disabled={!data.sandboxUrl || isFrameLoading}
						onClick={() => {
							if (!data.sandboxUrl) return;
							window.open(data.sandboxUrl, '_blank', 'noopener,noreferrer');
						}}
					>
						<ExternalLinkIcon />
					</Button>
				</Hint>
			</div>

			<iframe
				key={fragmentKey}
				className='size-full'
				sandbox='allow-forms allow-scripts allow-same-origin'
				loading='lazy'
				src={data.sandboxUrl}
				title={data.title}
				onLoad={() => setIsFrameLoading(false)}
				onError={() => setIsFrameLoading(false)}
			/>
		</div>
	);
};
