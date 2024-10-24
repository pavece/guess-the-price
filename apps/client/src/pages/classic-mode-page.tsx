import { GuessCard } from '@/components/classic-mode/guess-card';
import { ProductCard } from '@/components/classic-mode/product-card';
import { ResultsCard } from '@/components/classic-mode/results-card';
import { Product } from '@/interfaces/product.interface';
import { useEffect, useState } from 'react';

const guessPrice = async (productId: string, price: number) => {
	return fetch(import.meta.env.VITE_API_URL + `/guess/product?guessedPrice=${price}&productId=${productId}`, {
		method: 'POST',
	}).then(r => r.json());
};

export const ClassicModePage = () => {
	const [product, setProduct] = useState<Product | null>(null);

	useEffect(() => {
		fetch(import.meta.env.VITE_API_URL + '/random/product')
			.then(r => r.json())
			.then(data => setProduct(data));
	}, []);

	return (
		<div>
			<div>
				<h1 className='font-semibold text-3xl'>Classic mode</h1>
				<p className='text-zinc-800'>Get a random product and guess the price.</p>
			</div>
			{!product ? (
				<h1>Loading</h1>
			) : (
				<div className='mt-6 flex md:flex-row flex-col gap-4 flex-1'>
					<ProductCard
						title={product.name}
						image={product.image}
						priceInfo={product.priceMessage}
						source={product.source ?? 'Unknown source'}
					/>
					<GuessCard
						onGuess={async price => {
							const result = await guessPrice(product.id, price);
							console.log(result);
						}}
					/>
					{/* <ResultsCard /> */}
				</div>
			)}
		</div>
	);
};
