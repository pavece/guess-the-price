import { v4 as uuid } from 'uuid';
import { generateUsername } from 'unique-username-generator';
import { MPSessionDatasource } from '../../../domain/multiplayer/mp-session-manager';
import { MpSession } from '../../../domain/multiplayer/session';
import { Server } from 'socket.io';

export class MPSessionService {
	private static sessionManager = new MPSessionDatasource();

	public static handlePlayerConnection(
		socketId: string,
		io: Server,
		sessionId?: string
	): { session: MpSession; player: { name: string; id: string } } {
		const player = this.createPlayer();

		if (this.sessionManager.isSocketOwnerOfSession(socketId)) {
			throw new Error('You are the owner of a session');
		}

		if (!sessionId) {
			const session = new MpSession({ ...player, isHost: true, socketId }, io);
			this.sessionManager.addSession(session);
			return { session, player };
		}

		const session = this.sessionManager.getSession(sessionId);
		if (!session) {
			throw new Error('The session does not exist');
		}

		if (session.isSocketConnected(socketId)) {
			throw new Error('You are already connected to this session');
		}

		session.addPlayer({ ...player, isHost: false, socketId });
		return { session, player };
	}

	public static createPlayer() {
		const name = generateUsername('-');
		const id = uuid();

		return { name, id };
	}
}
