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
		this.socketIoServer.of('/mp-ws').on('connection', socket => {
			//Session management
			socket.on('join-session', session => {
				try {
					this.mpSessionService.handlePlayerConnection(session);
				} catch {
					socket.emit('exception', { msg: 'The session does not exist' });
				}
			});
		});
	}
}
