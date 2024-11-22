import { Socket } from 'socket.io';
import { SocketError } from '../socket-error';
import { ExceptionOutgoingPayload } from '../../interfaces/mp-payloads.types';

export const handleSocketError = (error: unknown, socket: Socket) => {
	if (error instanceof SocketError) {
		socket.emit('exception', { msg: error.message } as ExceptionOutgoingPayload);
	} else {
		console.error(error);
		socket.emit('exception', { msg: 'Unknown server error' } as ExceptionOutgoingPayload);
	}
};
