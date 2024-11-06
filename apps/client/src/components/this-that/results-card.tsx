import { HouseSimple } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';
import { Joystick } from 'lucide-react';

interface Props {
	guesses: number;
	onContinue: () => void;
}

export const ResultsCard = ({ guesses, onContinue }: Props) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Results</CardTitle>
				<CardDescription>How many correct guesses you 've made ?</CardDescription>
			</CardHeader>

			<CardContent className='text-center'>
				<h1 className='text-6xl font-bold'>{guesses}</h1>
				<p className='text-zinc-700'>Guesses</p>
			</CardContent>
			<CardFooter className='flex flex-row gap-2'>
				<Link to='/'>
					<Button className='bg-red-500 hover:bg-red-600'>
						<HouseSimple size={24} /> Main menu
					</Button>
				</Link>

				<Button className='w-full min-w-[240px]' onClick={onContinue}>
					<Joystick size={24} /> Play again
				</Button>
			</CardFooter>
		</Card>
	);
};
