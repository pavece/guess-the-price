import { Server, Socket } from 'socket.io';
import { MPSessionsService } from '../services/multiplayer/mp-sessions.service';
import { handleSocketError } from '../../domain/errors/handle-socket-error';
import { SocketError } from '../../domain/errors/socket-error';
import { IncomingEvents, OutgoingEvents } from '../../domain/interfaces/mp-events.types';
import { JoinSessionPayload, ReconnectPayload } from '../../domain/interfaces/mp-payloads.types';

export const gameSessionSocketHandler = (io: Server, socket: Socket) => {
	let currentSessionID: string | null = null;

	const joinSession = (payload: JoinSessionPayload) => {
		try {
			const { session, player } = MPSessionsService.handlePlayerConnection(socket.id, io, payload.sessionId);
			currentSessionID = session.id;
			socket.join(session.id);

			socket.emit(OutgoingEvents.SESSION_DETAILS, {
				sessionId: session.id,
				host: session.host.name,
				currentlyPlaying: !!session.getCurrentRoundPublic(),
			});
			socket.emit(OutgoingEvents.PLAYER_DETAILS, { playerName: player.name, playerId: player.id });
			
			io.of('/mp-ws').to(session.id).emit(OutgoingEvents.PLAYER_JOINS_SESSION, { playerName: player.name });
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const reconnect = (payload: ReconnectPayload) => {
		try {
			if (!payload.playerId || !payload.sessionId) {
				throw new SocketError('Provide a session id and playerId');
			}
			
			const { player, sessionDetails } = MPSessionsService.handlePlayerReconnection(
				payload.sessionId,
				payload.playerId,
				socket.id
			);

			socket.emit(OutgoingEvents.PLAYER_DETAILS, { playerName: player.name, playerId: player.id });
			socket.emit(OutgoingEvents.SESSION_DETAILS, sessionDetails);
			io.of('/mp-ws').to(payload.sessionId).emit(OutgoingEvents.PLAYER_RECONNECTS, { playerName: player.name });
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const disconnect = () => {
		if (!currentSessionID) return;
		MPSessionsService.handlePlayerDisconnection(socket.id, currentSessionID);
	};

	socket.on(IncomingEvents.PLAYER_JOIN_SESSION, joinSession);
	socket.on(IncomingEvents.PLAYER_RECONNECT, reconnect);
	socket.on('disconnect', disconnect);
};
