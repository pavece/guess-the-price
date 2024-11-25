import { create } from 'zustand';

interface VolatileMpStore {
	sessionStarted: boolean;
	currentlyPlaying: boolean;

	startRound: () => void;
	endRound: () => void;
	reset: () => void;
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => void;
}

export const useVolatileMpStore = create<VolatileMpStore>()(set => ({
	sessionStarted: false,
	currentlyPlaying: false,

	startRound: () => set(() => ({ sessionStarted: true, currentlyPlaying: true })),
	endRound: () => set(() => ({ currentlyPlaying: false })),
	reset: () => set(() => ({ sessionStarted: false, currentlyPlaying: false })),
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => set(() => ({ sessionStarted, currentlyPlaying })),
}));
