import { ProductCard } from '@/components/this-that/product-card';
import { ResultsCard } from '@/components/this-that/results-card';
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
	const [products, setProducts] = useState<{ selectedProduct: Product; newProduct: Product } | null>(null);
	const [playing, setPlaying] = useState(true);
	const [guesses, setGuesses] = useState(0);
	const [showingResult, setShowingResult] = useState(false);

	useEffect(() => {
		setProducts(null);

		getProducts().then(data => {
			setProducts(data);
		});
	}, []);

	const restartGame = () => {
		setProducts(null);

		setPlaying(true);
		setGuesses(0);
		setShowingResult(false);

		getProducts().then(data => {
			setProducts(data);
		});
	};

	const selectProduct = async (selected: Product) => {
		if (showingResult) return;

		setShowingResult(true);
		
		//NOTE: Selected product from API response has nothing to do with newly selected product in client
		const nonSelected = products?.selectedProduct === selected ? products.newProduct : products?.selectedProduct;

		if (selected.price >= nonSelected!.price) {
			const newProducts = await getProducts(selected.id);

			setTimeout(() => {
				setProducts(newProducts);
				setGuesses(g => g + 1);
				setShowingResult(false);
			}, 1500);
		} else {
			setTimeout(() => {
				setProducts(null);
				setPlaying(false);
				setShowingResult(false);
			}, 1500);
		}
	};

	if (!playing) {
		return (
			<>
				<div>
					<div className='mb-10'>
						<h1 className='font-semibold text-3xl'>This or that mode</h1>
						<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
					</div>
					<div className='w-full flex items-center justify-center'>
						<ResultsCard guesses={guesses} onContinue={restartGame} />
					</div>
				</div>
			</>
		);
	}

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>This or that mode</h1>
				<p className='text-zinc-800'>Get two products and guess which one is more expensive.</p>
			</div>

			{!products ? (
				<Loading />
			) : (
				<div className='flex flex-row gap-4 items-center'>
					<ProductCard
						showingResult={true}
						product={products.selectedProduct}
						onSelect={() => {
							selectProduct(products.selectedProduct);
						}}
					/>
					<div className='rounded-lg border border-stone-200 bg-white text-stone-950 shadow-sm p-3'>
						<h2 className='text-2xl font-semibold'>VS</h2>
					</div>
					<ProductCard
						showingResult={showingResult}
						product={products.newProduct}
						animate
						onSelect={() => {
							selectProduct(products.newProduct);
						}}
					/>
				</div>
			)}
		</div>
	);
};
