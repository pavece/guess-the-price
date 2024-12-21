import { PlayerRoundResultsRecord } from '@/interfaces/mp.interfaces';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { SignOut } from '@phosphor-icons/react';
import { SkipForward } from 'lucide-react';
import { DestructiveActionButton } from '../ui/confirmation-dialog';
import { motion } from 'framer-motion';
import Fireworks from 'react-canvas-confetti/dist/presets/fireworks';

interface Props {
	results: PlayerRoundResultsRecord[];
	playerName: string;
	isHost: boolean;

	onEndSession: () => void;
	onNextRound: () => void;
}

const containerVariant = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			delayChildren: 0.1,
			staggerChildren: 0.15,
		},
	},
};

const itemVariant = {
	hidden: { opacity: 0, x: 50 },
	visible: { opacity: 1, x: 0 },
};

export const RoundResultsCard = ({ results, playerName, isHost, onNextRound, onEndSession }: Props) => {
	return (
		<>
			{results.length > 0 && results[0].playerName == playerName && results[0].points > 60 && (
				<Fireworks autorun={{ speed: 0.2 }} />
			)}
			<Card>
				<CardHeader>
					<CardTitle>Round results</CardTitle>
					<CardDescription>Let's see who performed the best this round!</CardDescription>
				</CardHeader>
				<CardContent>
					<motion.div initial='hidden' animate='visible' className='flex gap-4 flex-col' variants={containerVariant}>
						{!results.length && <h1 className='text-lg font-semibold'>Nobody guessed...</h1>}
						{results.map((result, i) => (
							<motion.div
								variants={itemVariant}
								className='flex justify-between items-center p-4 rounded-md border dark:border-zinc-800'
								key={result.playerName}
							>
								<div className='flex flex-col md:flex-row gap-2 items-start justify-start'>
									<div className='flex gap-2 items-center justify-start'>
										<h3 className='text-lg font-semibold'>#{i + 1}</h3>
										<h3 className='font-medium'>
											{result.playerName} {playerName == result.playerName && '(You)'}
										</h3>
									</div>
									<div>
										<p className='text-zinc-600 dark:text-zinc-400'>
											Guessed price:{' '}
											<span className='text-neutral-900 dark:text-zinc-100 font-semibold'>{result.guessedPrice}$</span>
										</p>
										<p className='text-zinc-600 dark:text-zinc-400'>
											Points:{' '}
											<span className='text-neutral-900 dark:text-zinc-100 font-semibold'>{result.points}/100</span>
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
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
		</>
	);
};
