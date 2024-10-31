import { Check } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';

interface Props {
	title: string;
	source: string;
	priceMessage: string;
	image: string;
	price?: number;
}

export const ProductCard = ({ title, source, priceMessage, price, image }: Props) => {
	return (
		<Card className='w-full pt-6'>
			<CardContent className='w-full flex flex-row gap-4'>
				<div className='min-w-[50%] h-[300px] overflow-hidden relative'>
					<img src={image} alt={`${title}'s image`} className='object-cover absolute' />
				</div>
				<div className='[&>p]:mb-2 [&>p]:text-sm  [&>h3]:font-medium'>
					<h3>Product name</h3>
					<p className='break-words text-wrap whitespace-normal'>{title}</p>

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
