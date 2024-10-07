import { Server } from './presentation/server';
import 'dotenv/config';

async function main() {
	const server = new Server(Number(process.env.PORT) || 3000);

	server.start();
}

(() => {
	main();
})();