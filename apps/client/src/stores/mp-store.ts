import { create } from 'zustand';

export const useMpStore = create(set => ({
	playerId: '',
	playerName: '',
	isHost: false,

	joinSession: (playerId: string, playerName: string, isHost: boolean) => set(() => ({ playerId, playerName, isHost })),
}));
