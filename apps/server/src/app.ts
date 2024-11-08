import { Server } from './presentation/server';
import 'dotenv/config';
import http from 'http';
import { WSService } from './presentation/services/ws.service';

async function main() {
	const server = new Server();
	const httpServer = http.createServer(server.app);

	WSService.init(httpServer);

	httpServer.listen(Number(process.env.PORT) || 3000, () => {
		console.log(`Server listening on port: ${Number(process.env.PORT) || 3000}`);
	});

	server.start();
}

(() => {
	main();
})();
