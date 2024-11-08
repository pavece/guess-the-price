import { Server as HttpServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';

export class WSService {
	private static _instance: WSService;
	private socketIoServer: SocketIoServer;

	constructor(httpServer: HttpServer) {
		this.socketIoServer = new SocketIoServer(httpServer);
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
		this.socketIoServer.of("/mp-ws").on('connection', socket => {
			console.log(socket);
		});
	}
}
