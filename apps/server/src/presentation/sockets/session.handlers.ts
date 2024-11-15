import { Server, Socket } from 'socket.io';
import { MPSessionsService } from '../services/multiplayer/mp-sessions.service';
import { handleSocketError } from '../../domain/errors/handle-socket-error';
import { SocketError } from '../../domain/errors/socket-error';

export const gameSessionSocketHandler = (io: Server, socket: Socket) => {
	let currentSessionID: string | null = null;

	const joinSession = (payload: object) => {
		try {
			const { session, player } = MPSessionsService.handlePlayerConnection(socket.id, io, String(payload));
			socket.join(session.id);
			currentSessionID = session.id;
			socket.emit('session:details', {
				sessionId: session.id,
				host: session.host.name,
				currentlyPlaying: !!session.getCurrentRoundPublic(),
			});
			socket.emit('player:details', { playerName: player.name, playerId: player.id });
			io.of('/mp-ws').to(session.id).emit('player:joins', { playerName: player.name });
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const reconnect = (payload: { playerId: string; sessionId: string }) => {
		try {
			if (!payload.playerId || !payload.sessionId) {
				throw new SocketError('Provide a session id and playerID');
			}
			const { player, sessionDetails } = MPSessionsService.handlePlayerReconnection(
				payload.sessionId,
				payload.playerId,
				socket.id
			);
			socket.emit('player:details', { playerName: player.name, playerId: player.id });
			socket.emit('session:details', sessionDetails);
			io.of('/mp-ws').to(payload.sessionId).emit('player:reconnects', { playerName: player.name });
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const disconnect = () => {
		if (!currentSessionID) return;
		MPSessionsService.handlePlayerDisconnection(socket.id, currentSessionID);
	};

	socket.on('join-session', joinSession);
	socket.on('reconnect', reconnect);
	socket.on('disconnect', disconnect);
};
