import { GuessCard } from '@/components/classic-mode/guess-card';
import { ProductCard } from '@/components/classic-mode/product-card';

export const ClassicModePage = () => {
	return (
		<div>
			<div>
				<h1 className='font-semibold text-3xl'>Classic mode</h1>
				<p className='text-zinc-800'>Get a random product and guess the price.</p>
			</div>
			<div className='mt-6 flex md:flex-row flex-col gap-4 flex-1'>
				<ProductCard />
				<GuessCard />
			</div>
		</div>
	);
};
