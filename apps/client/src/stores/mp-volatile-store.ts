import { create } from 'zustand';

interface VolatileMpStore {
	sessionStarted: boolean;
	currentlyPlaying: boolean;
	connectedToSession: boolean;
	showingRoundResults: boolean;
	showingSessionResults: boolean;
	waitingForResults: boolean;
	guessedPrice: number;
	playersLeft: number;

	startRound: () => void;
	endRound: () => void;
	reset: () => void;
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => void;
	setConnected: (connected: boolean) => void;
	guessPrice: (price: number) => void;
	updatePlayersLeft: (left: number) => void
}

export const useVolatileMpStore = create<VolatileMpStore>()(set => ({
	sessionStarted: false,
	currentlyPlaying: false,
	connectedToSession: false,
	showingRoundResults: false,
	showingSessionResults: false,
	waitingForResults: false,
	guessedPrice: 0,
	playersLeft: 0,

	startRound: () =>
		set(() => ({
			sessionStarted: true,
			currentlyPlaying: true,
			showingRoundResults: false,
			showingSessionResults: false,
		})),
	endRound: () => set(() => ({ currentlyPlaying: false, showingRoundResults: true, waitingForResults: false })),
	reset: () => set(() => ({ sessionStarted: false, currentlyPlaying: false })),
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => set(() => ({ sessionStarted, currentlyPlaying })),
	setConnected: (connected: boolean) => set(() => ({ connectedToSession: connected })),
	guessPrice: (price: number) => set(() => ({ waitingForResults: true, guessedPrice: price  })),
	updatePlayersLeft: (left: number) => set(() => ({playersLeft: left}))
}));
