import { IncomingEvents } from '@/interfaces/mp-events.types';
import { StartRoundPayload } from '@/interfaces/mp-payloads.types';
import { socket } from '@/socket';
import { useMpStore } from '@/stores/mp-store';

export const useMultiplayerSession = () => {
	const mpStore = useMpStore();

	const hostStartRound = () => {
		if (mpStore.isHost) {
			socket.emit(IncomingEvents.HOST_STARTS_ROUND, { playerId: mpStore.playerId } as StartRoundPayload);
			mpStore.startRound();
		}
	};

	return {
		hostStartRound,
	};
};
