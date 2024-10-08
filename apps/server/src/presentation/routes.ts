import { Router } from 'express';
import { RandomRoutes } from './random/routes';
import { ProductRoutes } from './product/routes';
import { productBodyValidation } from '../domain/middlewares/product-validation.middleware';

export class AppRoutes {
	private randomRoutes = new RandomRoutes();
	private productRoutes = new ProductRoutes();

	public get routes() {
		const router = Router();

		router.use('/random', this.randomRoutes.routes);
		router.use('/product', productBodyValidation, this.productRoutes.routes);

		return router;
	}
}
