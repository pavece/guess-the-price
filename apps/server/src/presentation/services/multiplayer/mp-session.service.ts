import { v4 as uuid } from 'uuid';
import { generateUsername } from 'unique-username-generator';
import { MPSessionManager } from '../../../domain/multiplayer/mp-session-manager';
import { MpSession } from '../../../domain/multiplayer/session';

export class MPSessionService {
	private sessionManager = new MPSessionManager();

	public handlePlayerConnection(sessionId?: string) {
		const player = this.createPlayer();

		if (!sessionId) {
			const session = new MpSession({ ...player, isHost: true });
			this.sessionManager.addSession(session);
			return;
		}

		const session = this.sessionManager.getSession(sessionId);
		if (session) {
			session.addPlayer({ ...player, isHost: false });
			return;
		}

		throw new Error('The session does not exist');
	}

	public createPlayer() {
		const name = generateUsername('-');
		const id = uuid();

		return { name, id };
	}
}
