import express from 'express';
import cors from 'cors';
import { AppRoutes } from './routes';

export class Server {
	public readonly app = express();
	private readonly appRoutes = new AppRoutes();
	private readonly port: number;

	constructor(port: number) {
		this.port = port;
	}

	public async start() {
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(express.json());
		this.app.use(cors());

		this.app.use('/api', this.appRoutes.routes);

		this.app.listen(this.port, () => {
			console.log(`Server listening on port ${this.port}`);
		});
	}
}
