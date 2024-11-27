import { IncomingEvents, OutgoingEvents } from '@/interfaces/mp-events.types';
import { StartRoundPayload } from '@/interfaces/mp-payloads.types';
import { socket } from '@/socket';
import { useMpStore } from '@/stores/mp-store';
import { useVolatileMpStore } from '@/stores/mp-volatile-store';
import { useEffect } from 'react';
import { RoundStartsOutgoingPayload } from '../interfaces/mp-payloads.types';

export const useMultiplayerSession = () => {
	const mpStore = useMpStore();
	const mpVolatileStore = useVolatileMpStore();

	const hostStartRound = () => {
		if (mpStore.isHost) {
			socket.emit(IncomingEvents.HOST_STARTS_ROUND, { playerId: mpStore.playerId } as StartRoundPayload);
			mpVolatileStore.startRound();
		}
	};

	useEffect(() => {
		const onRoundStart = (payload: RoundStartsOutgoingPayload) => {
			mpStore.loadRoundProduct(payload.product);
			console.log(payload.startTime, payload.seconds);
			mpVolatileStore.startRound()
		};

		socket.on(OutgoingEvents.ROUND_STARTS, onRoundStart);

		return () => {
			socket.off(OutgoingEvents.ROUND_STARTS, onRoundStart);
		};
	}, []);

	return {
		hostStartRound,
	};
};
