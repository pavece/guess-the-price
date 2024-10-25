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
	const [resultsVisible, setResultsVisible] = useState(false);
	const [guessedResults, setGuessedResults] = useState<[number, number, number] | null>(null);
	const [results, setResults] = useState<{ title: string; points: number }[]>([]);

	const fetchProduct = () => {
		setProduct(null);
		fetch(import.meta.env.VITE_API_URL + '/random/product')
			.then(r => r.json())
			.then(data => setProduct(data));
	};

	useEffect(() => {
		fetchProduct();
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

					{!resultsVisible && (
						<GuessCard
							onGuess={async price => {
								const result = await guessPrice(product.id, price);

								setGuessedResults([result.points, result.originalPrice, result.guessedPrice]);
								setResults(results => [...results, { title: product.name, points: result.points }]);
								setResultsVisible(true);
							}}
						/>
					)}

					{resultsVisible && (
						<ResultsCard
							points={guessedResults?.[0] ?? 0}
							guessedPrice={guessedResults?.[2] ?? 0}
							originalPrice={guessedResults?.[1] ?? 0}
							onContinue={() => {
								setResultsVisible(false);
								fetchProduct();
							}}
							onFinish={() => {
								console.log(results);
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
};
