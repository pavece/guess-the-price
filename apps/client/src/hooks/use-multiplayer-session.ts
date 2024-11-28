import { IncomingEvents, OutgoingEvents } from '@/interfaces/mp-events.types';
import { PlayerGuessOutgoingPayload, StartRoundPayload } from '@/interfaces/mp-payloads.types';
import { socket } from '@/socket';
import { useMpStore } from '@/stores/mp-store';
import { useVolatileMpStore } from '@/stores/mp-volatile-store';
import { useEffect } from 'react';
import { RoundStartsOutgoingPayload, GuessPricePayload } from '../interfaces/mp-payloads.types';

export const useMultiplayerSession = () => {
	const mpStore = useMpStore();
	const mpVolatileStore = useVolatileMpStore();

	const hostStartRound = () => {
		if (mpStore.isHost) {
			socket.emit(IncomingEvents.HOST_STARTS_ROUND, { playerId: mpStore.playerId } as StartRoundPayload);
			mpVolatileStore.startRound();
		}
	};

	const guessPrice = (guessedPrice: number) => {
		if (mpVolatileStore.currentlyPlaying && mpStore.roundData.product) {
			socket.emit(IncomingEvents.PLAYER_GUESS_PRICE, { guessedPrice, playerId: mpStore.playerId } as GuessPricePayload);
			mpVolatileStore.guessPrice(guessedPrice);
		}
	};

	useEffect(() => {
		const onRoundStart = (payload: RoundStartsOutgoingPayload) => {
			mpStore.loadRoundProduct(payload.product);
			mpVolatileStore.startRound();
		};

		const onRoundEnd = (payload: unknown) => {
			console.log(payload);
			mpVolatileStore.endRound();
		};

		const onPlayerGuess = (payload: PlayerGuessOutgoingPayload) => {
			mpVolatileStore.updatePlayersLeft(payload.players - (payload.currentGuesses ?? payload.players));
		};

		socket.on(OutgoingEvents.ROUND_STARTS, onRoundStart);
		socket.on(OutgoingEvents.ROUND_ENDS, onRoundEnd);
		socket.on(OutgoingEvents.PLAYER_GUESS, onPlayerGuess);

		return () => {
			socket.off(OutgoingEvents.ROUND_STARTS, onRoundStart);
			socket.off(OutgoingEvents.ROUND_ENDS, onRoundEnd);
			socket.off(OutgoingEvents.PLAYER_GUESS, onPlayerGuess);
		};
	}, []);

	return {
		hostStartRound,
		guessPrice,
	};
};
