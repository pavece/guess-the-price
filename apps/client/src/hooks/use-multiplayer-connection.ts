import { useEffect, useState } from 'react';
import { socket } from '../socket';
import {
	ExceptionOutgoingPayload,
	JoinSessionPayload,
	PlayerDetailsOutgoingPayload,
	SessionDetailsOutgoingPayload,
} from '@/interfaces/mp-payloads.types';
import { IncomingEvents, OutgoingEvents } from '@/interfaces/mp-events.types';
import { useMpStore } from '@/stores/mp-store';
import { useNavigate } from 'react-router-dom';
import { useVolatileMpStore } from '@/stores/mp-volatile-store';

const connect = () => {
	if (!socket.connected) {
		socket.connect();
	}
};

const createSession = () => {
	socket.emit(IncomingEvents.PLAYER_JOIN_SESSION, {});
};

const connectToExistingSession = (sessionId: string) => {
	socket.emit(IncomingEvents.PLAYER_JOIN_SESSION, { sessionId } as JoinSessionPayload);
};

export const useMultiplayerConnection = () => {
	const [socketError, setSocketError] = useState<null | string>(null);
	const { setSession, setPlayer } = useMpStore();
	const { loadSession } = useVolatileMpStore()
	const navigate = useNavigate();

	useEffect(() => {
		connect();

		const onSessionDetails = (sessionPayload: SessionDetailsOutgoingPayload, playerPayload: PlayerDetailsOutgoingPayload) => {
			if (!sessionPayload || !playerPayload) return;

			setSession({sessionId: sessionPayload.sessionId, players: sessionPayload.players});
			setPlayer({ ...playerPayload, isHost: sessionPayload.host === playerPayload.playerName });
			loadSession(false, sessionPayload.currentlyPlaying)

			if (sessionPayload.host === playerPayload.playerName) {
				//Joining as host from mp joining page
				navigate(`/multiplayer/${sessionPayload.sessionId}`);
			}
		};

		const onSocketError = (payload: ExceptionOutgoingPayload) => {
			if (payload.msg) {
				setSocketError(payload.msg);
			} else {
				setSocketError('Unknown multiplayer error.');
			}
		};

		socket.on(OutgoingEvents.SESSION_DETAILS, onSessionDetails);
		socket.on(OutgoingEvents.EXCEPTION, onSocketError);

		return () => {
			socket.off(OutgoingEvents.SESSION_DETAILS, onSessionDetails);
			socket.off(OutgoingEvents.EXCEPTION, onSocketError);
		};
	}, []);

	return {
		socketError,
		createSession,
		connectToExistingSession,
	};
};
