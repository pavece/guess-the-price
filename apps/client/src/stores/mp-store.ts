import { persist, createJSONStorage } from 'zustand/middleware';
import { create } from 'zustand';

export interface PlayerDetails {
	playerId: string;
	playerName: string;
	isHost: boolean;
}

export interface SessionDetails {
	sessionId: string;
	sessionCurrentlyPlaying: boolean;
}

interface MpState extends PlayerDetails, SessionDetails {
	setSession: (details: SessionDetails) => void;
	setPlayer: (details: PlayerDetails) => void;
}

export const useMpStore = create<MpState>()(
	persist(
		set => ({
			sessionId: '',
			sessionCurrentlyPlaying: false,
			playerId: '',
			playerName: '',
			isHost: false,

			setSession: (details: SessionDetails) => set(() => ({ ...details })),
			setPlayer: (details: PlayerDetails) => set(() => ({ ...details })),
		}),
		{
			name: 'multiplayer',
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
