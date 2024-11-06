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
	const [products, setProducts] = useState<{ selectedProduct: Product; newProduct: Product } | null>(null);

	useEffect(() => {
		getProducts().then(data => {
			setProducts(data);
		});
	}, []);

	const selectProduct = async (selected: Product) => {
		setSelectedProduct(selected);

		//NOTE: Selected product from API response has nothing to do with newly selected product in client
		const nonSelected = products?.selectedProduct === selected ? products.newProduct : products?.selectedProduct;

		if (selected.price > nonSelected!.price) {
			setProducts(await getProducts(selected.id));
		} else {
			console.log('Loose');
			setProducts(null);
			setSelectedProduct(null);
		}
	};

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>This or that mode</h1>
				<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
			</div>
			{!products?.selectedProduct ? (
				<Loading />
			) : (
				<div className='flex flex-row gap-4 items-center'>
					<ProductCard
						selectedId={selectedProduct?.id ?? ''}
						product={products.selectedProduct}
						onSelect={() => {
							selectProduct(products.selectedProduct);
						}}
					/>
					<div className='rounded-lg border border-stone-200 bg-white text-stone-950 shadow-sm p-3'>
						<h2 className='text-2xl font-semibold'>VS</h2>
					</div>
					<ProductCard
						selectedId={selectedProduct?.id ?? ''}
						product={products.newProduct}
						onSelect={() => {
							selectProduct(products.newProduct);
						}}
					/>
				</div>
			)}
		</div>
	);
};
