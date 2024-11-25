import { useParams } from 'react-router-dom';
import { useMultiplayerConnection } from '@/hooks/use-multiplayer-connection';
import { useMpStore } from '@/stores/mp-store';
import { useEffect } from 'react';
import { socket } from '@/socket';
import { PlayerJoinsOutgoingPayload } from '@/interfaces/mp-payloads.types';
import { OutgoingEvents } from '@/interfaces/mp-events.types';
import { ShareSessionCard } from '@/components/multiplayer/share-session-card';
import { useMultiplayerSession } from '@/hooks/use-multiplayer-session';

export const MultiplayerPage = () => {
	const { id } = useParams();
	const mpStore = useMpStore();

	const { connectToExistingSession } = useMultiplayerConnection();
	const { hostStartRound } = useMultiplayerSession();

	useEffect(() => {
		if (id && !mpStore.playerId && !mpStore.sessionId) {
			connectToExistingSession(id);
		}
	}, [id, connectToExistingSession, mpStore.playerId, mpStore.sessionId]);

	useEffect(() => {
		const playerJoinsSession = (payload: PlayerJoinsOutgoingPayload) => {
			console.log(payload);
			if (payload.playerName === mpStore.playerName) return;
			mpStore.setPlayers(payload.players);
		};

		const onRoundStart = (payload: unknown) => {
			mpStore.startRound();
			console.log(payload);
		};

		socket.on(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);
		socket.on(OutgoingEvents.ROUND_STARTS, onRoundStart);

		return () => {
			socket.off(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);
			socket.off(OutgoingEvents.ROUND_STARTS, onRoundStart);
		};
	}, []);

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>Multiplayer</h1>
				<p className='text-zinc-800'>Play the classic mode with your friends.</p>
			</div>
			<div>
				{mpStore.sessionStatus.sessionStarted ? (
					<div>Session started</div>
				) : (
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
			</div>
		</div>
	);
};
