import { v4 as uuid } from 'uuid';

export interface Player {
	name: string;
	id: string;
	isHost: boolean;
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
		if (!player.name || !player.id) {
			throw new Error('Cannot add player with empty id or name');
		}
	}

	public removePlayer(player: Player) {
		this.players.filter(p => p.id !== player.id);
	}
}
