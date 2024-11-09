import { Server as HttpServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import { MPSessionService } from './multiplayer/mp-session.service';

export class WSService {
	private static _instance: WSService;
	private socketIoServer: SocketIoServer;

	private mpSessionService: MPSessionService;

	constructor(httpServer: HttpServer) {
		this.socketIoServer = new SocketIoServer(httpServer);
		this.mpSessionService = new MPSessionService();
		this.start();
	}

	static init(httpServer: HttpServer) {
		if (this._instance) {
			return;
		}
		this._instance = new WSService(httpServer);
	}

	static get instance() {
		if (!this._instance) {
			throw new Error('Instance not initialized');
		}

		return this._instance;
	}

	public start() {
		//TODO: Move this to specific event handlers
		this.socketIoServer.of('/mp-ws').on('connection', socket => {
			//Session management
			socket.on('join-session', sessionId => {
				try {
					const { session, player } = this.mpSessionService.handlePlayerConnection(sessionId);
					socket.join(session.id);
					socket.emit('session:details', { sessionId: session.id, host: session.host.name });
					this.socketIoServer.of('/mp-ws').to(session.id).emit('session:player:joins', { playerName: player.name });
				} catch {
					socket.emit('exception', { msg: 'The session does not exist' });
				}
			});
		});
	}
}
