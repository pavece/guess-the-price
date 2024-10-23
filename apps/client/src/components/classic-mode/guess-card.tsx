import { FormEvent, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';

export const GuessCard = () => {
	const [guessedPrice, setGuessedPrice] = useState<string | number>('');

	const guessPrice = (e: FormEvent) => {
		e.preventDefault();
		console.log(Number(guessedPrice));
	};

	return (
		<Card className='max-h-fit min-w-[350px] flex-1'>
			<CardHeader>
				<CardTitle>Your guess</CardTitle>
				<CardDescription>Make sure to check price information and then choose the price.</CardDescription>
			</CardHeader>
			<CardContent>
				<form className='space-y-4' onSubmit={guessPrice}>
					<Input
						type='number'
						placeholder='12.3'
						value={guessedPrice}
						onChange={e => setGuessedPrice(e.target.value)}
					/>
					<Button className='w-full' type='submit'>
						Guess
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
