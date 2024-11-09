import { Server, Socket } from 'socket.io';
import { MPSessionService } from '../services/multiplayer/mp-session.service';

export const gameSessionSocketHandler = (io: Server, socket: Socket) => {
	const joinSession = (payload: object) => {
		try {
			const { session, player } = MPSessionService.handlePlayerConnection(socket.id, String(payload));
			socket.join(session.id);
			socket.emit('session:details', { sessionId: session.id, host: session.host.name });
			io.of('/mp-ws').to(session.id).emit('session:player:joins', { playerName: player.name });
		} catch {
			socket.emit('exception', { msg: 'The session does not exist' });
		}
	};

	socket.on('join-session', joinSession);
};
