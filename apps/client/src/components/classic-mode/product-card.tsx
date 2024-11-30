import CountUp from 'react-countup';
import { Card, CardContent } from '../ui/card';
import { Image } from '../ui/image';

interface Props {
	title: string;
	image: string;
	source: string;
	priceInfo: string;
	price?: number;
}

export const ProductCard = ({ title, image, source, priceInfo, price }: Props) => {
	return (
		<Card className='w-full md:w-[60%] pt-6 '>
			<CardContent className='flex lg:flex-row flex-col gap-4'>
				<Image src={image} alt='Product image' className='min-w-[400px]' />

				<div>
					<h2 className='text-xl mb-2 font-semibold'>{title}</h2>

					<h3 className='text-md font-medium'>Source</h3>
					<p className='text-sm'>{source}</p>
					<h3 className='mt-2 text-md font-medium'>Price information</h3>
					<p className='text-sm'>{priceInfo}</p>

					{price && (
						<>
							<h3 className='mt-2 text-md font-medium'>Price</h3>
							<h2 className='text-3xl font-bold'>
								<CountUp end={price} decimal=',' decimals={2} duration={1.5} />$
							</h2>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
};
