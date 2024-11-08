import { MpSession } from './session';

export class MPSessionManager {
	private static _instance: MPSessionManager;
	private sessions = new Map<string, MpSession>();

	constructor() {
		if (MPSessionManager._instance) {
			return MPSessionManager._instance;
		}

		MPSessionManager._instance = this;
		return this;
	}

	public addSession(session: MpSession) {
		this.sessions.set(session.id, session);
	}

	public removeSession(id: string) {
		this.sessions.delete(id);
	}

	public getSession(id: string) {
		return this.sessions.get(id) ?? null;
	}
}
