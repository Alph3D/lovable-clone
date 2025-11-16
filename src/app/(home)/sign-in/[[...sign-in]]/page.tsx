import { SignIn } from '@clerk/nextjs';

const SignInPage = () => {
	return (
		<div className='mx-auto flex w-full max-w-3xl flex-col'>
			<section className='space-y-6 pt-[16vh] 2xl:pt-48'>
				<div className='flex flex-col items-center'>
					<SignIn />
				</div>
			</section>
		</div>
	);
};

export default SignInPage;
