import { Router } from 'express';
import { RandomController } from './controller';

export class RandomRoutes {
	private randomController = new RandomController();

	public get routes() {
		const router = Router();

		router.get('/product', this.randomController.getRandomProduct);

		return router;
	}
}
