import { Server, Socket } from 'socket.io';
import { MPSessionDatasource } from '../../domain/multiplayer/mp-session-manager';

export const sessionRoundsSocketHandlers = (io: Server, socket: Socket) => {
	const sessionDatasource = new MPSessionDatasource();

	const startRound = async (payload: object) => {
		const session = sessionDatasource.getSession([...socket.rooms][1]);
		if (!session) {
			throw new Error('Player is not in a valid session');
		}

		if (session.host.id !== String(payload)) {
			throw new Error('Only the host can start rounds');
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { guesses, ...rest } = await session.startRound();
		io.of('/mp-ws').to(session.id).emit('round:start', rest);
	};

	const guessPrice = async (payload: { price: number; playerId: string }) => {
		const session = sessionDatasource.getSession([...socket.rooms][1]);

		if (!session) {
			throw new Error('Player is not in a valid session');
		}

		if (!payload.playerId) {
			throw new Error('Please include the player id');
		}

		if (!Number(payload.price)) {
			throw new Error('Please specify a valid price');
		}

		await session.guessPrice(payload.playerId, Number(payload.price));
		const guessesLeft = session.getGuessesLeft();

		if (guessesLeft.currentGuesses !== guessesLeft.players) {
			io.of('/mp-ws').to(session.id).emit('player:guess', session.getGuessesLeft());
		}
	};

	socket.on('start-round', startRound);
	socket.on('guess-price', guessPrice);
};
