import { Card, CardContent } from '../ui/card';

export const ProductCard = () => {
	return (
		<Card className='max-w-fit pt-6'>
			<CardContent className='flex lg:flex-row flex-col gap-4'>
				<div>
					<img
						src='https://images.unsplash.com/photo-1600626333392-59a20e646d97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						alt="Product name's image"
						className='max-w-[460px] rounded-sm'
					/>
				</div>
				<div>
					<h2 className='text-xl mb-2 font-semibold'>Some product</h2>

					<h3 className='text-md font-medium'>Source</h3>
					<p className='text-sm'>Some source</p>
					<h3 className='mt-2 text-md font-medium'>Price information</h3>
					<p className='text-sm'>Lorem ipsum dolor sit amet consectetur.</p>
				</div>
			</CardContent>
		</Card>
	);
};
