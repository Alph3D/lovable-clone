import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';

const HomePage = async () => {
	const users = await db.user.findMany();

	return (
		<div>
			<h1 className='text-4xl font-bold'>Home Page</h1>

			<Button variant='destructive' size='lg'>
				Click me
			</Button>

			<pre>{JSON.stringify(users, null, 2)}</pre>
		</div>
	);
};

export default HomePage;
