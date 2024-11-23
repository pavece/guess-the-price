import { useEffect } from 'react';
import { socket } from '../socket';
import { JoinSessionPayload } from '@/interfaces/mp-payloads.types';
import { IncomingEvents } from '@/interfaces/mp-events.types';

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

export const useMultiplayer = () => {
	useEffect(() => {
		connect();
	}, []);

	return {
		createSession,
		connectToExistingSession,
	};
};
