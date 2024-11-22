import { Server, Socket } from 'socket.io';
import { MPSessionsService } from '../services/multiplayer/mp-sessions.service';
import { handleSocketError } from '../../domain/errors/handlers/handle-socket-error';
import { IncomingEvents, OutgoingEvents } from '../../domain/interfaces/mp-events.types';
import {
	JoinSessionPayload,
	PlayerDetailsOutgoingPayload,
	PlayerJoinsOutgoingPayload,
	PLayerReconnectsOutgoingPayload,
	ReconnectPayload,
	SessionDetailsOutgoingPayload,
} from '../../domain/interfaces/mp-payloads.types';
import { validateMpPayload } from '../../domain/validation/validate-mp-payload';
import {
	JoinSessionPayloadSchema,
	ReconnectPayloadSchema,
} from '../../domain/validation/mp-payloads-validation.schema';

export const gameSessionSocketHandler = (io: Server, socket: Socket) => {
	let currentSessionID: string | null = null;

	const joinSession = (payload: JoinSessionPayload) => {
		try {
			validateMpPayload(payload, JoinSessionPayloadSchema);

			const { session, player } = MPSessionsService.handlePlayerConnection(socket.id, io, payload.sessionId);
			currentSessionID = session.id;
			socket.join(session.id);

			socket.emit(OutgoingEvents.SESSION_DETAILS, {
				sessionId: session.id,
				host: session.host.name,
				currentlyPlaying: !!session.currentRound,
			} as SessionDetailsOutgoingPayload);
			socket.emit(OutgoingEvents.PLAYER_DETAILS, {
				playerName: player.name,
				playerId: player.id,
			} as PlayerDetailsOutgoingPayload);

			io.of('/mp-ws')
				.to(session.id)
				.emit(OutgoingEvents.PLAYER_JOINS_SESSION, { playerName: player.name } as PlayerJoinsOutgoingPayload);
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const reconnect = (payload: ReconnectPayload) => {
		try {
			validateMpPayload(payload, ReconnectPayloadSchema);

			const { player, sessionDetails } = MPSessionsService.handlePlayerReconnection(
				payload.sessionId,
				payload.playerId,
				socket.id
			);

			socket.emit(OutgoingEvents.PLAYER_DETAILS, {
				playerName: player.name,
				playerId: player.id,
			} as PlayerDetailsOutgoingPayload);
			socket.emit(OutgoingEvents.SESSION_DETAILS, sessionDetails as SessionDetailsOutgoingPayload);
			socket.join(payload.sessionId);
		
			io.of('/mp-ws')
				.to(payload.sessionId)
				.emit(OutgoingEvents.PLAYER_RECONNECTS, { playerName: player.name } as PLayerReconnectsOutgoingPayload);
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
