import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000/mp-ws', { autoConnect: false }); //TODO: Update to env var
