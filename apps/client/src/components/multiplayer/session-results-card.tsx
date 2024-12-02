import { PlayerSessionResultsRecord } from '@/interfaces/mp.interfaces';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useMpStore } from '@/stores/mp-store';
import { Button } from '../ui/button';
import { GameController, SignOut } from '@phosphor-icons/react';

interface Props {
	results: PlayerSessionResultsRecord[];
	roundsPlayed: number;
	isHost: boolean;

	onTerminateSession: () => void;
	onContinuePlaying: () => void;
}

export const SessionResultsCard = ({ results, roundsPlayed, isHost, onTerminateSession, onContinuePlaying }: Props) => {
	const playerName = useMpStore(state => state.playerName);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Session results</CardTitle>
				<CardDescription>This session ended, let's see the results.</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-4'>
					{results.map((result, i) => (
						<>
							<div className='flex justify-between items-center p-4 rounded-md border'>
								<div className='flex gap-2 items-center justify-start'>
									<h3 className='text-lg font-semibold'>#{i + 1}</h3>
									<h3 className='font-medium'>
										{result.playerName} {playerName == result.playerName && '(You)'}
									</h3>
								</div>
								<div className='text-start'>
									<p className='text-neutral-600'>
										Total points:
										<span className='ml-1 text-neutral-900 font-semibold'>
											{result.points}/{100 * roundsPlayed}
										</span>
									</p>
									<p className='text-neutral-600'>
										Best guess: <span className='ml-1 text-neutral-900 font-semibold'>{result.bestGuess}/100</span>
									</p>
								</div>
							</div>
						</>
					))}
				</div>
			</CardContent>
			{isHost && (
				<CardFooter className='flex-col items-start gap-2'>
					<div className='flex flex-row gap-4 w-full'>
						<Button variant='destructive' onClick={onTerminateSession}>
							<SignOut size={24} /> Terminate session
						</Button>
						<Button className='w-full' onClick={onContinuePlaying}>
							<GameController size={24} /> Play again
						</Button>
					</div>
					<p className='text-sm text-neutral-600'>
						*You are the host of this session, you can restart the session and continue playing with the same players.
						Or you can terminate the session to stop playing.
					</p>
				</CardFooter>
			)}
		</Card>
	);
};
