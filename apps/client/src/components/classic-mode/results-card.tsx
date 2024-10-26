import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';

export interface ResultRecord {
	title: string;
	points: number;
	image: string;
	originalPrice: number;
	guessedPrice: number;
}

interface Props {
	guesses: ResultRecord[];
	onContinue: () => void;
}

export const ResultsCard = ({ guesses, onContinue }: Props) => {
	const [bestGuess, setBestGuess] = useState<ResultRecord | null>(null);

	useEffect(() => {
		let best = guesses[0];
		guesses.forEach(guess => {
			if (guess.points > best.points) best = guess;
		});

		setBestGuess(best);
	}, [guesses]);

	return (
		<Card className='md:min-w-[500px]'>
			<CardHeader>
				<CardTitle>Results</CardTitle>
				<CardDescription>Check your results and play again.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex items-center justify-center gap-24'>
					<div>
						<h2 className='text-3xl font-bold'>{guesses.length}</h2>
						<p className='text-md text-zinc-500'>Guesses</p>
					</div>
					<div>
						<h2 className='text-3xl font-bold'>
							{guesses.reduce((prev, curr) => prev + curr.points, 0)} / {guesses.length * 100}
						</h2>
						<p className='text-md text-zinc-500'>Points</p>
					</div>
				</div>
				{(bestGuess?.points ?? 0) > 0 && (
					<div className='mt-4'>
						<h2 className='text-xl font-semibold mb-2'>Best guess</h2>
						<div className='flex flex-row gap-2'>
							<img src={bestGuess?.image} alt={bestGuess?.title + "'s image"} className='max-w-[150px]' />
							<div>
								<p className='text-lg font-semibold'>{bestGuess?.title}</p>
								<p>Original price: {bestGuess?.originalPrice}</p>
								<p>Your price: {bestGuess?.guessedPrice}</p>
								<p>
									Points: <span className='font-semibold'>{bestGuess?.points} / 100</span>
								</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter className='flex flex-row gap-2'>
				<Link to='/'>
					<Button className='bg-red-500 hover:bg-red-600'>Main menu</Button>
				</Link>

				<Button className='w-full' onClick={onContinue}>
					Play again
				</Button>
			</CardFooter>
		</Card>
	);
};
