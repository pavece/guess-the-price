import { ProductCard } from '@/components/this-that/product-card';
import { Loading } from '@/components/ui/loading';
import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';

export const ThisOrThatPage = () => {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		fetch(import.meta.env.VITE_API_URL + `/random/product/highLow`, {
			method: 'POST',
		})
			.then(r => r.json())
			.then(data => setProducts(data));
	}, []);

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>This or that mode</h1>
				<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
			</div>
			{!products.length && <Loading />}

			{products.length && (
				<div className='flex flex-row gap-4 items-center'>
					<ProductCard
						image={products[0].image}
						title={products[0].name}
						priceMessage={products[0].priceMessage}
						source={products[0].source ?? 'Unknown source'}
					/>
					<div className='rounded-lg border border-stone-200 bg-white text-stone-950 shadow-sm p-3'>
						<h2 className='text-2xl font-semibold'>VS</h2>
					</div>
					<ProductCard
						image={products[1].image}
						title={products[1].name}
						priceMessage={products[1].priceMessage}
						source={products[1].source ?? 'Unknown source'}
					/>
				</div>
			)}
		</div>
	);
};
