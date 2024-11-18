import 'dotenv/config';
import { v4 as uuid } from 'uuid';
import { SocketError } from '../errors/socket-error';
import { Server } from 'socket.io';
import { RandomProduct } from '../interfaces/product.interface';
import { compareDates } from '../../utils/compare-dates';

const SECONDS_PER_ROUND = 30;
const SECONDS_INACTIVE = 180;
const SECONDS_PLAYER_INACTIVE = 10;

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
	seconds: number;
	guesses: PlayerGuess[];
}
export class MpSession {
	public readonly host: Player;
	public readonly id: string;
	public players: Player[] = [];
	public lastActive: Date;

	public currentRound: Round | null;
	public pastRounds: Round[];

	private readonly io: Server;
	public seenProducts: string[];

	constructor(host: Player, io: Server) {
		this.host = host;
		this.players.push(host);
		this.id = uuid();
		this.currentRound = null;
		this.pastRounds = [];
		this.seenProducts = [];
		this.io = io;
		this.lastActive = new Date();
	}

	//Player management
	public addPlayer(player: Player) {
		if (!player.name || !player.id) {
			throw new SocketError('Cannot add player with empty id or name.');
		}

		if (this.players.length >= (Number(process.env.MAX_PLAYERS_SESSION) || 10)) {
			throw new SocketError('The session is full.');
		}

		this.players.push(player);
		this.refreshActivity();
		return player;
	}

	public reconnectPlayer(playerId: string, socketId: string) {
		const existingPlayer = this.players.find(p => p.id === playerId);

		if (existingPlayer) {
			existingPlayer.socketId = socketId;
			existingPlayer.disconnectedAt = undefined;
			return existingPlayer;
		}
	}

	public playerDisconnected(socketId: string) {
		const disconnectedPlayer = this.players.find(player => player.socketId == socketId);
		if (!disconnectedPlayer) return;

		disconnectedPlayer.disconnectedAt = new Date();
	}

	public removePlayer(player: Player) {
		this.players = this.players.filter(p => p.id !== player.id);
		this.io.of('/mp-ws').to(this.id).emit('player:leaves', player.name);
	}

	public isSocketConnected(socketId: string) {
		const player = this.players.find(player => player.socketId == socketId);
		return !!player;
	}

	//Rounds & game
	public startRound(product: RandomProduct) {
		this.seenProducts.push(product!.id);
		this.currentRound = { product: product!, startTime: new Date(), seconds: SECONDS_PER_ROUND, guesses: [] };
		this.refreshActivity();
		return this.currentRound;
	}

	public async guessPrice(playerId: string, points: number, guessedPrice: number) {
		if (!this.currentRound) {
			throw new SocketError('The round has finished');
		}
		if (this.currentRound.guesses.find(guess => guess.playerId == playerId)) {
			throw new SocketError('Player has already guessed the price');
		}
		const player = this.players.find(player => player.id == playerId);
		if (!player) {
			throw new SocketError('Player is not in the session');
		}

		this.currentRound.guesses.push({
			playerId,
			guessedPrice,
			points: points,
			playerName: player.name,
		});

		if (this.currentRound.guesses.length === this.players.length) {
			this.endRound();
		}

		this.refreshActivity();
	}

	public endRound() {
		if (!this.currentRound) {
			throw new SocketError('No active round');
		}

		this.pastRounds.push({ ...this.currentRound });
		this.io.of('/mp-ws').to(this.id).emit('round:ends', this.getCurrentRoundPublic());
		this.currentRound = null;
		this.refreshActivity();
	}

	public getGuessesLeft() {
		return {
			currentGuesses: this.currentRound?.guesses.length,
			players: this.players.length,
		};
	}

	public getCurrentRoundPublic() {
		if (!this.currentRound) return null;
		const modifiedGuesses = this.currentRound.guesses.map(g => {
			return {
				guessedPrice: g.guessedPrice,
				points: g.points,
				playerName: g.playerName,
			};
		});

		const { guesses, ...rest } = this.currentRound;
		return { ...rest, modifiedGuesses };
	}

	public endSession() {
		this.io.of('/mp-ws').to(this.id).emit('session:ends');
	}

	public getResults() {
		//TODO
	}

	//Housekeeping
	public roundTick() {
		if (!this.currentRound) return;

		if (compareDates(this.currentRound.startTime, new Date()) >= SECONDS_PER_ROUND) {
			this.endRound();
		}
	}

	public playerCleanupTick() {
		this.players.forEach(player => {
			if (!player.disconnectedAt) return;

			if (compareDates(player.disconnectedAt, new Date()) >= SECONDS_PLAYER_INACTIVE) {
				this.removePlayer(player);
			}
		});
	}

	public refreshActivity() {
		this.lastActive = new Date();
	}

	public checkSessionActive() {
		if (compareDates(this.lastActive, new Date()) >= SECONDS_INACTIVE) {
			this.endSession();
			return false;
		}
		return true;
	}
}
