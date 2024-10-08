import { Router } from 'express';
import { RandomRoutes } from './random/routes';
import { ProductRoutes } from './product/routes';

export class AppRoutes {
	private randomRoutes = new RandomRoutes();
	private productRoutes = new ProductRoutes();

	public get routes() {
		const router = Router();

		router.use('/random', this.randomRoutes.routes);
		router.use('/product', this.productRoutes.routes);

		return router;
	}
}
