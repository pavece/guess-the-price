import 'dotenv/config';
import { v4 as uuid } from 'uuid';
import { Server } from 'socket.io';

import { SocketError } from '../errors/socket-error';
import { compareDates } from '../../utils/compare-dates';

import { OutgoingEvents } from '../interfaces/mp-events.types';
import { Player, Round } from '../interfaces/mp.interfaces';
import { RandomProduct } from '../interfaces/product.interface';

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
		this.io.of('/mp-ws').to(this.id).emit(OutgoingEvents.PLAYER_LEAVES, { playerName: disconnectedPlayer.name });
	}

	public isSocketConnected(socketId: string) {
		const player = this.players.find(player => player.socketId == socketId);
		return !!player;
	}

	//Rounds & game
	public startRound(product: RandomProduct) {
		this.seenProducts.push(product!.id);
		this.currentRound = {
			product: product!,
			startTime: new Date(),
			seconds: Number(process.env.MP_SESSION_ROUND_DURATION_SECONDS ?? 30),
			guesses: [],
		};
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
		this.io.of('/mp-ws').to(this.id).emit(OutgoingEvents.ROUND_ENDS, this.getCurrentRoundPublic());
		this.currentRound = null;
		this.refreshActivity();
	}

	public getGuessesLeft() {
		return {
			currentGuesses: this.currentRound?.guesses.length,
			players: this.players.length,
			roundEnded: !!this.currentRound,
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
		this.io.of('/mp-ws').to(this.id).emit(OutgoingEvents.SESSION_ENDS);
	}

	public getResults() {
		//TODO
	}

	//Housekeeping
	public roundTick() {
		if (!this.currentRound) return;

		if (
			compareDates(this.currentRound.startTime, new Date()) >=
			Number(process.env.MP_SESSION_ROUND_DURATION_SECONDS ?? 30)
		) {
			this.endRound();
		}
	}

	public refreshActivity() {
		this.lastActive = new Date();
	}

	public checkSessionActive() {
		if (compareDates(this.lastActive, new Date()) >= Number(process.env.MP_SESSION_INACTIVE_SECONDS ?? 180)) {
			this.endSession();
			return false;
		}
		return true;
	}
}
