import { v4 as uuid } from 'uuid';
import 'dotenv/config';
import { RandomService } from '../../presentation/services/random.service';
import { RandomProduct } from '../interfaces/product.interface';
import { GuessService } from '../../presentation/services/guess.service';

export interface Player {
	name: string;
	id: string;
	isHost: boolean;
	socketId: string;
	disconnectedAt?: Date; //Will be used to determine if its a real disconnection or just networking issues
}
interface PlayerGuess {
	guessedPrice: number;
	points: number;
	playerId: string;
	playerName: string;
}
export interface Round {
	product: RandomProduct;
	startTime: Date;
	guesses: PlayerGuess[];
}
export class MpSession {
	public readonly host: Player;
	public readonly id: string;
	private players: Player[] = [];

	private currentRound: Round | null;
	private pastRounds: Round[];
	private seenProducts: string[];

	constructor(host: Player) {
		this.host = host;
		this.players.push(host);
		this.id = uuid();
		this.currentRound = null;
		this.pastRounds = [];
		this.seenProducts = [];
	}

	public addPlayer(player: Player) {
		//TODO: Implement custom error types for sockets
		if (!player.name || !player.id) {
			throw new Error('Cannot add player with empty id or name.');
		}

		if (this.players.length >= (Number(process.env.MAX_PLAYERS_SESSION) || 10)) {
			throw new Error('The session is full.');
		}

		this.players.push(player);
	}

	public removePlayer(player: Player) {
		this.players.filter(p => p.id !== player.id);
	}

	public isSocketConnected(socketId: string) {
		const player = this.players.find(player => player.socketId == socketId);
		return !!player;
	}

	//Rounds
	public async startRound() {
		try {
			const product = await RandomService.getRandomProduct(this.seenProducts);
			this.seenProducts.push(product!.id);

			this.currentRound = { product: product!, startTime: new Date(), guesses: [] };
		} catch {
			throw new Error('Cannot start session');
		}
	}

	public async guessPrice(playerId: string, guessedPrice: number) {
		if (!this.currentRound) {
			throw new Error('The round has finished');
		}
		if (this.currentRound.guesses.find(guess => guess.playerId == playerId)) {
			throw new Error('Player has already guessed the price');
		}
		const player = this.players.find(player => player.id == playerId);
		if (!player) {
			throw new Error('Player is not in the session');
		}

		try {
			const results = await GuessService.guessProductPrice(this.currentRound.product.id, guessedPrice);
			this.currentRound.guesses.push({
				playerId,
				guessedPrice,
				points: results?.points ?? 0,
				playerName: player.name,
			});
		} catch {
			throw new Error('Could not guess the price for this product');
		}
	}

	public endRound() {
		if (!this.currentRound) {
			throw new Error('No active round');
		}

		this.pastRounds.push({ ...this.currentRound });
		this.currentRound = null;
	}
}
