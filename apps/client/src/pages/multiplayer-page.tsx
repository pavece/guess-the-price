import { useParams } from 'react-router-dom';
import { useMultiplayerConnection } from '@/hooks/use-multiplayer-connection';
import { useMpStore } from '@/stores/mp-store';
import { useEffect } from 'react';
import { socket } from '@/socket';
import { PlayerJoinsOutgoingPayload } from '@/interfaces/mp-payloads.types';
import { OutgoingEvents } from '@/interfaces/mp-events.types';
import { ShareSessionCard } from '@/components/multiplayer/share-session-card';

export const MultiplayerPage = () => {
	const { id } = useParams();
	const mpStore = useMpStore();
	const { connectToExistingSession } = useMultiplayerConnection();

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

		socket.on(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);

		return () => {
			socket.off(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);
		};
	}, []);

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>Multiplayer</h1>
				<p className='text-zinc-800'>Play the classic mode with your friends.</p>
			</div>
			<div>
				<div className='flex items-center justify-center'>
					<ShareSessionCard isHost={mpStore.isHost} playerName={mpStore.playerName} sessionId={mpStore.sessionId} playerNumber={mpStore.players} onStart={() => {}} />
				</div>
			</div>
		</div>
	);
};
