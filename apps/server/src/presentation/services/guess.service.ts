import { PrismaClient } from '@prisma/client';
import { ControllerError } from '../../domain/errors/controller-error';

const DIFFERENCE_LIMIT = 40;

export class GuessService {
	prisma = new PrismaClient();

	public guessProductPrice = async (productId: string, guessedPrice: number) => {
		try {
			const product = await this.prisma.product.findFirst({ where: { id: productId } });

			if (!product) {
				throw new ControllerError('Product not found', 404);
			}

			const productPrice = product.price as unknown as number;
			const diffPercentage = Math.abs(Math.floor(guessedPrice / (productPrice / 100) - 100));
			let points = 0;

			if (diffPercentage == 0) {
				points = 100;
			} else if (diffPercentage >= DIFFERENCE_LIMIT) {
				points = 0;
			} else {
				points = 100 - diffPercentage * (100 / DIFFERENCE_LIMIT);
			}

			return { originalPrice: productPrice, guessedPrice, points: Math.ceil(points) };
		} catch (error) {
			console.error(error);

			if (error instanceof ControllerError) {
				throw error;
			}

			throw new ControllerError(`Cannot guess the price for product ${productId}`, 500);
		}
	};
}
