import { Check } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

interface Props {
	title: string;
	source: string;
	priceMessage: string;
	price?: number;
}

export const ProductCard = ({ title, source, priceMessage, price }: Props) => {
	return (
		<Card className='max-w-[50%] pt-6'>
			<CardContent className='flex flex-row gap-4'>
				<div className='max-w-[75%]'>
					<img
						src='https://images.unsplash.com/photo-1729731322052-6009acfd3d2c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
						alt={`${title}'s image`}
						className='rounded-sm'
					/>
				</div>
				<div className='min-w-fit [&>p]:mb-2 [&>p]:text-sm  [&>h3]:font-medium'>
					<h3>Product name</h3>
					<p>{title}</p>

					<h3>Source</h3>
					<p>{source}</p>

					<h3>Price message</h3>
					<p>{priceMessage}</p>

					<h3>Price</h3>
					<p>{price ?? '???'}</p>
				</div>
			</CardContent>
			<CardFooter>
				<Button className='w-full'>
					<Check size={24} /> Select this one
				</Button>
			</CardFooter>
		</Card>
	);
};
