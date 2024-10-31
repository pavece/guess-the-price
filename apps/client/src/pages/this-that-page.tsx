import { ProductCard } from '@/components/this-that/product-card';
import { Loading } from '@/components/ui/loading';
import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';

const getProducts = async (current?: string) => {
	return fetch(import.meta.env.VITE_API_URL + `/random/product/highLow`, {
		method: 'POST',
		body: JSON.stringify({ current }),
		headers: { 'Content-type': 'application/json' },
	}).then(r => r.json());
};

export const ThisOrThatPage = () => {
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then(data => {
			setProducts(data);
			setSelectedProduct(data[0]);
		});
	}, []);

	const selectProduct = async (selected: Product) => {
		setSelectedProduct(selected);
		const nonSelected = products.find(p => p.id !== selected.id);

		if (selected.price > nonSelected!.price) {
			setProducts(await getProducts(selected.id));
		} else {
			console.log('Loose');
			setSelectedProduct(null);
			setProducts([]);
		}
	};

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>This or that mode</h1>
				<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
			</div>
			{!products.length ? (
				<Loading />
			) : (
				products.length && (
					<div className='flex flex-row gap-4 items-center'>
						<ProductCard
							image={products[0].image}
							title={products[0].name}
							priceMessage={products[0].priceMessage}
							source={products[0].source ?? 'Unknown source'}
							price={selectedProduct?.id == products[0].id ? selectedProduct.price : undefined}
							onSelect={() => {
								selectProduct(products[0]);
							}}
						/>
						<div className='rounded-lg border border-stone-200 bg-white text-stone-950 shadow-sm p-3'>
							<h2 className='text-2xl font-semibold'>VS</h2>
						</div>
						<ProductCard
							image={products[1].image}
							title={products[1].name}
							priceMessage={products[1].priceMessage}
							source={products[1].source ?? 'Unknown source'}
							price={selectedProduct?.id == products[1].id ? selectedProduct.price : undefined}
							onSelect={() => {
								selectProduct(products[1]);
							}}
						/>
					</div>
				)
			)}
		</div>
	);
};
