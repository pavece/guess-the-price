import { useEffect, useState } from 'react';
import { socket } from '../socket';
import {
	ExceptionOutgoingPayload,
	JoinSessionPayload,
	PlayerDetailsOutgoingPayload,
	ReconnectPayload,
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

export const useMultiplayerConnection = () => {
	const [socketError, setSocketError] = useState<null | string>(null);
	const { setSession, setPlayer, clear, sessionId, playerId } = useMpStore();
	const { loadSession, setConnected, connectedToSession, reset } = useVolatileMpStore();
	const navigate = useNavigate();

	const createSession = () => {
		if (!connectedToSession) {
			socket.emit(IncomingEvents.PLAYER_JOIN_SESSION, {});
		}
	};

	const connectToExistingSession = (sessionId: string) => {
		if (!connectedToSession) {
			socket.emit(IncomingEvents.PLAYER_JOIN_SESSION, { sessionId } as JoinSessionPayload);
		}
	};

	const leaveSession = () => {
		navigate('/');
		clear();
		reset();
		socket.disconnect();
	};

	useEffect(() => {
		connect();

		const onSessionDetails = (
			sessionPayload: SessionDetailsOutgoingPayload,
			playerPayload: PlayerDetailsOutgoingPayload
		) => {
			if (!sessionPayload || !playerPayload) return;

			setSession({ sessionId: sessionPayload.sessionId, players: sessionPayload.players });
			setPlayer({ ...playerPayload, isHost: sessionPayload.host === playerPayload.playerName });
			loadSession(false, sessionPayload.currentlyPlaying);
			setConnected(true);

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

		const onSocketDisconnect = () => {
			console.log('Socket disconnected');
			setConnected(false);
		};

		const onSocketConnect = () => {
			//Try to reconnect if you were in a session and socket lost connection to server
			if (!connectedToSession && socket.connected && sessionId && playerId) {
				socket.emit(IncomingEvents.PLAYER_RECONNECT, { playerId, sessionId } as ReconnectPayload);
			}
		};

		socket.on(OutgoingEvents.SESSION_DETAILS, onSessionDetails);
		socket.on(OutgoingEvents.EXCEPTION, onSocketError);
		socket.on('disconnect', onSocketDisconnect);
		socket.on('connect', onSocketConnect);

		return () => {
			socket.off(OutgoingEvents.SESSION_DETAILS, onSessionDetails);
			socket.off(OutgoingEvents.EXCEPTION, onSocketError);
			socket.off('disconnect', onSocketDisconnect);
			socket.off('connect', onSocketConnect);
		};
	});

	return {
		socketError,
		createSession,
		connectToExistingSession,
		leaveSession,
	};
};
