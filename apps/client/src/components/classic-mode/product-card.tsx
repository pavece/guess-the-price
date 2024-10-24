import { Card, CardContent } from '../ui/card';

interface Props {
	title: string;
	image: string;
	source: string;
	priceInfo: string;
}

export const ProductCard = ({ title, image, source, priceInfo }: Props) => {
	return (
		<Card className='max-w-fit pt-6'>
			<CardContent className='flex lg:flex-row flex-col gap-4'>
				<div>
					<img src={image} alt="Product name's image" className='max-w-[460px] rounded-sm' />
				</div>
				<div>
					<h2 className='text-xl mb-2 font-semibold'>{title}</h2>

					<h3 className='text-md font-medium'>Source</h3>
					<p className='text-sm'>{source}</p>
					<h3 className='mt-2 text-md font-medium'>Price information</h3>
					<p className='text-sm'>{priceInfo}</p>
				</div>
			</CardContent>
		</Card>
	);
};
