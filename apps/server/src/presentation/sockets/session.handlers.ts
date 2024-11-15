import { Server, Socket } from 'socket.io';
import { MPSessionsService } from '../services/multiplayer/mp-sessions.service';
import { handleSocketError } from '../../domain/errors/handle-socket-error';

export const gameSessionSocketHandler = (io: Server, socket: Socket) => {
	let currentSessionID: string | null = null;

	const joinSession = (payload: object) => {
		try {
			const { session, player } = MPSessionsService.handlePlayerConnection(socket.id, io, String(payload));
			socket.join(session.id);
			currentSessionID = session.id;
			socket.emit('session:details', { sessionId: session.id, host: session.host.name });
			socket.emit('player:details', { playerName: player.name, playerId: player.id });
			io.of('/mp-ws').to(session.id).emit('session:player:joins', { playerName: player.name });
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const disconnect = () => {
		if (!currentSessionID) return;
		MPSessionsService.handlePlayerDisconnection(socket.id, currentSessionID);
	};

	socket.on('join-session', joinSession);
	socket.on('disconnect', disconnect);
};
