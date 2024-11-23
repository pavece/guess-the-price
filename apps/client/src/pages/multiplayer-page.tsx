import { useMultiplayer } from '@/hooks/use-multiplayer';
import { OutgoingEvents } from '@/interfaces/mp-events.types';
import { PlayerDetailsOutgoingPayload, PlayerJoinsOutgoingPayload, SessionDetailsOutgoingPayload } from '@/interfaces/mp-payloads.types';
import { socket } from '@/socket';
import { useMpStore } from '@/stores/mp-store';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const MultiplayerPage = () => {
	const { id } = useParams();
	const mpStore = useMpStore();
	const { connectToExistingSession } = useMultiplayer();

	useEffect(() => {
		if (id && !mpStore.playerId && !mpStore.sessionId) {
			connectToExistingSession(id);
		}
	}, [id, connectToExistingSession, mpStore.playerId, mpStore.sessionId]);


	useEffect(() => {
		const sessionDetails = (sessionDetails: SessionDetailsOutgoingPayload, playerDetails: PlayerDetailsOutgoingPayload, ) => {
			mpStore.setSession({sessionId: sessionDetails.sessionId, sessionCurrentlyPlaying: sessionDetails.currentlyPlaying})
			mpStore.setPlayer({isHost: false, ...playerDetails})
		}

		const playerJoinsSession = (payload: PlayerJoinsOutgoingPayload) => {
			console.log(payload)
		}

		socket.on(OutgoingEvents.SESSION_DETAILS, sessionDetails);
		socket.on(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession);

		return () => {
			socket.off(OutgoingEvents.SESSION_DETAILS, sessionDetails);
			socket.off(OutgoingEvents.PLAYER_JOINS_SESSION, playerJoinsSession)
		}

	}, []);

	return (
		<div>
			<div className='mb-10'>
				<h1 className='font-semibold text-3xl'>Multiplayer</h1>
				<p className='text-zinc-800'>Play the classic mode with your friends.</p>
			</div>

			<p>{id}</p>
			<p>{mpStore.playerName}</p>
			
		</div>
	);
};
