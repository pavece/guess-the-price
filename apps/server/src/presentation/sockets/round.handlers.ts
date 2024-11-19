import { Server, Socket } from 'socket.io';
import { handleSocketError } from '../../domain/errors/handle-socket-error';
import { SocketError } from '../../domain/errors/socket-error';
import { MPGameService } from '../services/multiplayer/mp-game.service';
import { IncomingEvents, OutgoingEvents } from '../../domain/interfaces/mp-events.types';
import { GuessPricePayload, StartRoundPayload } from '../../domain/interfaces/mp-payloads.types';

export const sessionRoundsSocketHandlers = (io: Server, socket: Socket) => {
	const startRound = async (payload: StartRoundPayload) => {
		try {
			const round = await MPGameService.startRound([...socket.rooms][1], payload.playerId);
			io.of('/mp-ws').to([...socket.rooms][1]).emit(OutgoingEvents.ROUND_STARTS, round);
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const guessPrice = async (payload: GuessPricePayload) => {
		try {
			if (!payload.playerId) {
				throw new SocketError('Please include the player id');
			}

			if (!Number(payload.guessedPrice)) {
				throw new SocketError('Please specify a valid price');
			}

			const guessesLeft = await MPGameService.makeGuess([...socket.rooms][1], payload.playerId, payload.guessedPrice);

			if (guessesLeft.currentGuesses !== guessesLeft.players) {
				io.of('/mp-ws').to([...socket.rooms][1]).emit(OutgoingEvents.PLAYER_GUESS, guessesLeft);
			}
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	socket.on(IncomingEvents.HOST_STARTS_ROUND, startRound);
	socket.on(IncomingEvents.PLAYER_GUESS_PRICE, guessPrice);
};
