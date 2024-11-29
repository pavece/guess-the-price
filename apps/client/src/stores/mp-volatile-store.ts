import { PlayerRoundResultsRecord } from '@/interfaces/mp.interfaces';
import { RandomProduct } from '@/interfaces/product.interface';
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
	roundData: {
		product: RandomProduct | null;
		endTime: number;
		results: PlayerRoundResultsRecord[] | null;
	};

	startRound: (randomProduct: RandomProduct, endTime: number) => void;
	endRound: (playerResults: PlayerRoundResultsRecord[]) => void;
	reset: () => void;
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => void;
	setConnected: (connected: boolean) => void;
	guessPrice: (price: number) => void;
	updatePlayersLeft: (left: number) => void;
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
	roundData: {
		product: null,
		endTime: 0,
		results: null,
	},

	startRound: (randomProduct: RandomProduct, endTime: number) =>
		set(() => ({
			sessionStarted: true,
			currentlyPlaying: true,
			showingRoundResults: false,
			showingSessionResults: false,
			roundData: {
				product: randomProduct,
				endTime,
				results: null,
			},
		})),
	endRound: (results: PlayerRoundResultsRecord[]) =>
		set(state => ({
			currentlyPlaying: false,
			showingRoundResults: true,
			waitingForResults: false,
			roundData: { ...state.roundData, results },
		})),
	reset: () => set(() => ({ sessionStarted: false, currentlyPlaying: false })),
	loadSession: (sessionStarted: boolean, currentlyPlaying: boolean) => set(() => ({ sessionStarted, currentlyPlaying })),
	setConnected: (connected: boolean) => set(() => ({ connectedToSession: connected })),
	guessPrice: (price: number) => set(() => ({ waitingForResults: true, guessedPrice: price })),
	updatePlayersLeft: (left: number) => set(() => ({ playersLeft: left })),
}));
