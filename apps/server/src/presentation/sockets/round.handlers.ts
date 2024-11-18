import { Server, Socket } from 'socket.io';
import { handleSocketError } from '../../domain/errors/handle-socket-error';
import { SocketError } from '../../domain/errors/socket-error';
import { MPGameService } from '../services/multiplayer/mp-game.service';

export const sessionRoundsSocketHandlers = (io: Server, socket: Socket) => {
	//TODO: Update to new payload types
	const startRound = async (payload: object) => {
		try {
			const round = await MPGameService.startRound([...socket.rooms][1], String(payload));
			io.of('/mp-ws')
				.to([...socket.rooms][1])
				.emit('round:start', round);
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const guessPrice = async (payload: { price: number; playerId: string }) => {
		try {
			if (!payload.playerId) {
				throw new SocketError('Please include the player id');
			}

			if (!Number(payload.price)) {
				throw new SocketError('Please specify a valid price');
			}

			const guessesLeft = await MPGameService.makeGuess([...socket.rooms][1], payload.playerId, payload.price);

			if (guessesLeft.currentGuesses !== guessesLeft.players) {
				io.of('/mp-ws')
					.to([...socket.rooms][1])
					.emit('player:guess', guessesLeft);
			}
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	socket.on('start-round', startRound);
	socket.on('guess-price', guessPrice);
};
