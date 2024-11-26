import { useEffect } from 'react';
import { useToast } from './use-toast';
import { socket } from '@/socket';
import { OutgoingEvents } from '@/interfaces/mp-events.types';
import {
	ExceptionOutgoingPayload,
	PlayerJoinsOutgoingPayload,
	PlayerLeavesOutgoingPayload,
	PLayerReconnectsOutgoingPayload,
} from '@/interfaces/mp-payloads.types';

export const useMpNotifications = () => {
	const { toast } = useToast();

	useEffect(() => {
		if (!socket.connected) {
			console.error('Socket not connected, please connect the socket before using the notifier.');
		}

		const onPlayerJoin = (payload: PlayerJoinsOutgoingPayload) => {
			toast({ title: 'Player joins', description: payload.playerName });
		};

		const onPlayerLeave = (payload: PlayerLeavesOutgoingPayload) => {
			toast({ title: 'Player leaves', description: payload.playerName });
		};

		const onPlayerReconnect = (payload: PLayerReconnectsOutgoingPayload) => {
			toast({ title: 'Player reconnects', description: payload.playerName });
		};

		const onError = (payload: ExceptionOutgoingPayload) => {
			toast({ title: 'Error', description: payload.msg, variant: 'destructive' });
		};

		socket.on(OutgoingEvents.PLAYER_JOINS_SESSION, onPlayerJoin);
		socket.on(OutgoingEvents.PLAYER_LEAVES, onPlayerLeave);
		socket.on(OutgoingEvents.PLAYER_RECONNECTS, onPlayerReconnect);
		socket.on(OutgoingEvents.EXCEPTION, onError);

		return () => {
			socket.off(OutgoingEvents.PLAYER_JOINS_SESSION, onPlayerJoin);
			socket.off(OutgoingEvents.PLAYER_LEAVES, onPlayerLeave);
			socket.off(OutgoingEvents.PLAYER_RECONNECTS, onPlayerReconnect);
			socket.off(OutgoingEvents.EXCEPTION, onError);
		};
	}, [toast]);
};
