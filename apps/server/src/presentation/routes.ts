import { Router } from 'express';
import { RandomRoutes } from './random/routes';
import { ProductRoutes } from './product/routes';
import { productBodyValidation } from '../domain/middlewares/product-validation.middleware';
import { GuessRoutes } from './guess/routes';

export class AppRoutes {
	private randomRoutes = new RandomRoutes();
	private productRoutes = new ProductRoutes();
	private guessRoutes = new GuessRoutes();

	public get routes() {
		const router = Router();

		router.use('/random', this.randomRoutes.routes);
		router.use('/product', productBodyValidation, this.productRoutes.routes);
		router.use('/guess', this.guessRoutes.routes);

		return router;
	}
}
