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
	players: number;
}

interface MpState extends PlayerDetails, SessionDetails {
	sessionStatus: {
		sessionStarted: boolean;
	};
	setSession: (details: SessionDetails) => void;
	setPlayer: (details: PlayerDetails) => void;
	setPlayers: (players: number) => void;

	startRound: () => void;
	endRound: () => void;
}

export const useMpStore = create<MpState>()(
	persist(
		set => ({
			sessionId: '',
			sessionCurrentlyPlaying: false,
			playerId: '',
			playerName: '',
			isHost: false,
			players: 0,
			sessionStatus: {
				sessionStarted: false,
			},

			setSession: (details: SessionDetails) => set(() => ({ ...details })),
			setPlayer: (details: PlayerDetails) => set(() => ({ ...details })),
			setPlayers: (players: number) => set(() => ({ players })),

			startRound: () => set(() => ({ sessionStatus: { sessionStarted: true }, sessionCurrentlyPlaying: true })),
			endRound: () => set(() => ({ sessionStatus: { sessionStarted: false }, sessionCurrentlyPlaying: false })),
		}),
		{
			name: 'multiplayer',
			storage: createJSONStorage(() => sessionStorage),
		}
	)
);
