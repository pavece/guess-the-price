import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

interface Props {
	points: number;
	originalPrice: number;
	guessedPrice: number;
	onContinue: () => void;
	onFinish: () => void;
}

export const ResultsCard = ({ points, originalPrice, guessedPrice, onContinue, onFinish }: Props) => {
	let resultColor = 'text-red-500';

	if (points >= 60) resultColor = 'text-green-500';
	if (points > 10 && points < 60) resultColor = 'text-yellow-500';

	return (
		<Card className='flex-1 max-h-fit'>
			<CardHeader>
				<CardTitle>Result</CardTitle>
				<CardDescription>Check the result and continue playing or get the final results.</CardDescription>
			</CardHeader>
			<CardContent className='text-center'>
				<h2 className={`text-3xl font-bold ${resultColor}`}>+{points}/100 Points</h2>
				<div className='mt-3'>
					<p className=' text-zinc-800'>
						Your price: <span className='font-semibold'>{guessedPrice}€</span>
					</p>
					<p className=' text-zinc-800'>
						Original price: <span className='font-semibold'>{originalPrice}€</span>
					</p>
				</div>
			</CardContent>
			<CardFooter className='flex flex-row gap-2'>
				<Button className='w-1/3 bg-red-500 hover:bg-red-600' onClick={onFinish}>
					End game
				</Button>
				<Button className='w-full' onClick={onContinue}>
					Continue playing
				</Button>
			</CardFooter>
		</Card>
	);
};
