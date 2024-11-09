import { v4 as uuid } from 'uuid';
import 'dotenv/config';

export interface Player {
	name: string;
	id: string;
	isHost: boolean;
	socketId: string;
	disconnectedAt?: Date; //Will be used to determine if its a real disconnection or just networking issues
}

export class MpSession {
	public readonly host: Player;
	public readonly id: string;
	private players: Player[] = [];

	constructor(host: Player) {
		this.host = host;
		this.players.push(host);
		this.id = uuid();
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
}
