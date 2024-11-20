import { RandomProduct } from './product.interface';

export interface Player {
	name: string;
	id: string;
	isHost: boolean;
	socketId: string;
	disconnectedAt?: Date;
}

export interface PlayerGuess {
	guessedPrice: number;
	points: number;
	playerId: string;
	playerName: string;
}

export interface Round {
	product: RandomProduct;
	startTime: Date;
	seconds: number;
	guesses: PlayerGuess[];
}
