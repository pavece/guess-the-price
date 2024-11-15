import { Socket } from 'socket.io';
import { SocketError } from './socket-error';

export const handleSocketError = (error: unknown, socket: Socket) => {
	if (error instanceof SocketError) {
		socket.emit('exception', { msg: error.message });
	} else {
		console.error(error);
		socket.emit('exception', { msg: 'Unknown server error' });
	}
};
