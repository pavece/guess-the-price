import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';
import { RandomProduct } from '@/interfaces/product.interface copy';

export interface PlayerDetails {
	playerId: string;
	playerName: string;
	isHost: boolean;
}

export interface SessionDetails {
	sessionId: string;
	players: number;
}

export interface RoundData {
	product: RandomProduct | null;
}

interface MpState extends PlayerDetails, SessionDetails {
	roundData: RoundData;
	setSession: (details: SessionDetails) => void;
	setPlayer: (details: PlayerDetails) => void;
	setPlayers: (players: number) => void;
	loadRoundProduct: (product: RandomProduct) => void;
}

export const useMpStore = create<MpState>()(
	persist(
		set => ({
			sessionId: '',
			playerId: '',
			playerName: '',
			isHost: false,
			players: 0,
			sessionStatus: {
				sessionStarted: false,
			},
			roundData: {
				product: null,
			},

			setSession: (details: SessionDetails) => set(() => ({ ...details })),
			setPlayer: (details: PlayerDetails) => set(() => ({ ...details })),
			setPlayers: (players: number) => set(() => ({ players })),
			loadRoundProduct: (product: RandomProduct) => set(() => ({ roundData: { product } })),
		}),
		{
			name: 'multiplayer',
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
