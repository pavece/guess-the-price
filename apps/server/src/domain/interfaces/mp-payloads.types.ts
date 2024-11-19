type RequiredPlayerId = {
	playerId: string;
};

export type JoinSessionPayload = {
	sessionId?: string;
};

export type GuessPricePayload = {
	playerId: string;
	guessedPrice: number;
};

export type ReconnectPayload = {
	playerId: string;
	sessionId: string;
};

export type StartRoundPayload = RequiredPlayerId;
export type ShowResultsPayload = RequiredPlayerId;
export type EndSessionPayload = RequiredPlayerId;
