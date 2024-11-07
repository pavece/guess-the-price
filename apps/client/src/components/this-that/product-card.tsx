import { CaretDoubleUp } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Product } from '@/interfaces/product.interface';
import CountUp from 'react-countup';
import { Image } from '../ui/image';

interface Props {
	product: Product;
	showingResult: boolean;
	animate?: boolean;
	onSelect: () => void;
}

export const ProductCard = ({
	product: { name, source, priceMessage, price, image },
	showingResult,
	animate = false,
	onSelect,
}: Props) => {
	return (
		<Card className='pt-6 w-full'>
			<CardContent className='w-full flex flex-row gap-4'>
				<Image
					src={image}
					alt={`${name}'s image`}
					className='w-fit lg:w-[50%] lg:min-w-[250px] min-w-[180px] lg:h-[300px]'
				/>
				<div className='[&>p]:mb-2 [&>p]:text-sm  [&>h3]:font-medium'>
					<h3>Product name</h3>
					<p className='break-words text-wrap whitespace-normal'>{name}</p>

					<h3>Source</h3>
					<p>{source}</p>

					<h3>Price message</h3>
					<p>{priceMessage}</p>

					{showingResult && (
						<>
							<h3>Price</h3>
							<h2 className='text-3xl font-bold'>
								<CountUp end={price} decimal=',' decimals={2} duration={animate ? 0.5 : 0.01} />$
							</h2>
						</>
					)}
				</div>
			</CardContent>
			<CardFooter>
				<Button className='w-full' onClick={onSelect}>
					<CaretDoubleUp size={24} /> Select this one
				</Button>
			</CardFooter>
		</Card>
	);
};
