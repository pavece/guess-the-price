import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export const ResultsCard = () => {
	return (
		<Card className='flex-1 max-h-fit'>
			<CardHeader>
				<CardTitle>Result</CardTitle>
				<CardDescription>Check the result and continue playing or get the final results.</CardDescription>
			</CardHeader>
			<CardContent className='text-center'>
				<h2 className='text-3xl font-bold'>+70/100 Points</h2>
				<div className='mt-3'>
					<p className=' text-zinc-800'>
						Your price: <span className='font-semibold'>{2.3}€</span>
					</p>
					<p className=' text-zinc-800'>
						Original price: <span className='font-semibold'>{2.7}€</span>
					</p>
				</div>
			</CardContent>
			<CardFooter className='flex flex-row gap-2'>
				<Button className='w-1/3 bg-red-500 hover:bg-red-600'>End game</Button>
				<Button className='w-full'>Continue playing</Button>
			</CardFooter>
		</Card>
	);
};
