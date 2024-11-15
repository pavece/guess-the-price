import { Server, Socket } from 'socket.io';
import { MPSessionDatasource } from '../../domain/multiplayer/mp-session-manager';
import { handleSocketError } from '../../domain/errors/handle-socket-error';
import { SocketError } from '../../domain/errors/socket-error';

export const sessionRoundsSocketHandlers = (io: Server, socket: Socket) => {
	const sessionDatasource = new MPSessionDatasource();

	const startRound = async (payload: object) => {
		try {
			const session = sessionDatasource.getSession([...socket.rooms][1]);
			if (!session) {
				throw new SocketError('Player is not in a valid session');
			}

			if (session.host.id !== String(payload)) {
				throw new SocketError('Only the host can start rounds');
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { guesses, ...rest } = await session.startRound();
			io.of('/mp-ws').to(session.id).emit('round:start', rest);
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	const guessPrice = async (payload: { price: number; playerId: string }) => {
		try {
			const session = sessionDatasource.getSession([...socket.rooms][1]);

			if (!session) {
				throw new SocketError('Player is not in a valid session');
			}

			if (!payload.playerId) {
				throw new SocketError('Please include the player id');
			}

			if (!Number(payload.price)) {
				throw new SocketError('Please specify a valid price');
			}

			await session.guessPrice(payload.playerId, Number(payload.price));
			const guessesLeft = session.getGuessesLeft();

			if (guessesLeft.currentGuesses !== guessesLeft.players) {
				io.of('/mp-ws').to(session.id).emit('player:guess', session.getGuessesLeft());
			}
		} catch (error) {
			handleSocketError(error, socket);
		}
	};

	socket.on('start-round', startRound);
	socket.on('guess-price', guessPrice);
};
