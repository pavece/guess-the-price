import { ProductCard } from '@/components/this-that/product-card';

export const ThisOrThatPage = () => {
	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>This or that mode</h1>
				<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
			</div>
			<div className='flex flex-row gap-4 items-center'>
				<ProductCard title='Some product' priceMessage='Some price message' source='Some source' />
				<div className='rounded-lg border border-stone-200 bg-white text-stone-950 shadow-sm p-3'>
					<h2 className='text-2xl font-semibold'>VS</h2>
				</div>
				<ProductCard title='Some product' priceMessage='Some price message' source='Some source' />
			</div>
		</div>
	);
};
