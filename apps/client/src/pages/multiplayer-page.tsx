import { useParams } from 'react-router-dom';
import { useMultiplayerConnection } from '@/hooks/use-multiplayer-connection';
import { useMpStore } from '@/stores/mp-store';
import { useEffect } from 'react';
import { socket } from '@/socket';
import { PlayerJoinsOutgoingPayload } from '@/interfaces/mp-payloads.types';
import { OutgoingEvents } from '@/interfaces/mp-events.types';
import { ShareSessionCard } from '@/components/multiplayer/share-session-card';
import { useMultiplayerSession } from '@/hooks/use-multiplayer-session';
import { useVolatileMpStore } from '@/stores/mp-volatile-store';
import { useMpNotifications } from '@/hooks/use-multiplayer-notification';
import { ProductCard } from '@/components/classic-mode/product-card';
import { GuessCard } from '@/components/classic-mode/guess-card';
import { Button } from '@/components/ui/button';
import { RoundTimer } from '@/components/multiplayer/round-timer';
import { WaitingForResultsCard } from '@/components/multiplayer/waiting-for-results-card';
import { SignOut } from '@phosphor-icons/react';

export const MultiplayerPage = () => {
	const { id } = useParams();
	const mpStore = useMpStore();
	const mpVolatileStore = useVolatileMpStore();
	useMpNotifications();

	const { connectToExistingSession } = useMultiplayerConnection();
	const { hostStartRound, guessPrice } = useMultiplayerSession();

	useEffect(() => {
		if (id && !mpStore.playerId && !mpStore.sessionId) {
			connectToExistingSession(id);
		}
	}, [id, connectToExistingSession, mpStore.playerId, mpStore.sessionId]);

	useEffect(() => {
		const playerJoinsSession = (payload: PlayerJoinsOutgoingPayload) => {
			if (payload.playerName === mpStore.playerName) return;
			mpStore.setPlayers(payload.players);
		};

		socket.on(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);

		return () => {
			socket.off(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);
		};
	}, []);

	return (
		<div>
			<div className='mb-10 flex justify-between items-end'>
				<div>
					<h1 className='font-semibold text-3xl'>Multiplayer</h1>
					<p className='text-zinc-800'>Play the classic mode with your friends.</p>
				</div>

				<div>
					<Button variant='destructive'>
						<SignOut size={24} /> Leave session
					</Button>
				</div>
			</div>
			<div>
				{!mpVolatileStore.sessionStarted && (
					<div className='flex items-center justify-center'>
						<ShareSessionCard
							isHost={mpStore.isHost}
							playerName={mpStore.playerName}
							sessionId={mpStore.sessionId}
							playerNumber={mpStore.players}
							onStart={hostStartRound}
						/>
					</div>
				)}

				{mpVolatileStore.currentlyPlaying &&
					mpVolatileStore.roundData.product &&
					!mpVolatileStore.waitingForResults && (
						<div className='flex gap-6'>
							<ProductCard
								image={mpVolatileStore.roundData.product?.image}
								priceInfo={mpVolatileStore.roundData.product?.priceMessage ?? ''}
								source={mpVolatileStore.roundData.product?.source ?? ''}
								title={mpVolatileStore.roundData.product?.name}
							/>
							<div className='flex-1'>
								<GuessCard onGuess={guessPrice} />
								<div className='p-4 bg-white border rounded-md mt-4 w-full'>
									<RoundTimer />
								</div>
							</div>
						</div>
					)}

				{mpVolatileStore.waitingForResults && (
					<div className='w-full flex items-center justify-center'>
						<WaitingForResultsCard />
					</div>
				)}

				{mpVolatileStore.showingRoundResults && (
					<>
						<div>Showing round results...</div>

						<div>{JSON.stringify(mpVolatileStore.roundData.results)}</div>

						<Button onClick={hostStartRound}>next round</Button>
					</>
				)}
			</div>
		</div>
	);
};
