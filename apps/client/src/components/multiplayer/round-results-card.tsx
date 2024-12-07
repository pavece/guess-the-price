import { PlayerRoundResultsRecord } from '@/interfaces/mp.interfaces';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { SignOut } from '@phosphor-icons/react';
import { SkipForward } from 'lucide-react';
import { DestructiveActionButton } from '../ui/confirmation-dialog';

interface Props {
	results: PlayerRoundResultsRecord[];
	playerName: string;
	isHost: boolean;

	onEndSession: () => void;
	onNextRound: () => void;
}

export const RoundResultsCard = ({ results, playerName, isHost, onNextRound, onEndSession }: Props) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Round results</CardTitle>
				<CardDescription>Let's see who performed the best this round!</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex gap-4 flex-col'>
					{!results.length && <h1 className='text-lg font-semibold'>Nobody guessed...</h1>}

					{results.map((result, i) => (
						<div className='flex justify-between items-center p-4 rounded-md border'>
							<div className='flex gap-2 items-center justify-start'>
								<h3 className='text-lg font-semibold'>#{i + 1}</h3>
								<h3 className='font-medium'>
									{result.playerName} {playerName == result.playerName && '(You)'}
								</h3>
							</div>
							<div>
								<p className='text-neutral-600'>
									Guessed price: <span className='text-neutral-900 font-semibold'>{result.guessedPrice}$</span>
								</p>
								<p className='text-neutral-600'>
									Points: <span className='text-neutral-900 font-semibold'>{result.points}/100</span>
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
			{isHost && (
				<CardFooter className='flex gap-2'>
					<DestructiveActionButton
						title='Are you sure?'
						description='If you end this session all the results will be cleared, but you will be able to continue playing with the same players if you want.'
						onConfirm={onEndSession}
					>
						<SignOut size={24} /> End session
					</DestructiveActionButton>
					<Button className='w-full' onClick={onNextRound}>
						<SkipForward size={24} /> Next round
					</Button>
				</CardFooter>
			)}
		</Card>
	);
};
