import { Router } from 'express';
import { RandomRoutes } from './random/routes';

export class AppRoutes {
	private randomRoutes = new RandomRoutes();

	public get routes() {
		const router = Router();

		router.use('/random', this.randomRoutes.routes);

		return router;
	}
}
