import { PrismaClient } from '@prisma/client';

const DIFFERENCE_LIMIT = 40;

export class GuessService {
	prisma = new PrismaClient();

	public guessProductPrice = async (productId: string, guessedPrice: number) => {
		try {
			const product = await this.prisma.product.findFirst({ where: { id: productId } });

			if (!product) {
				throw new Error('Product not found');
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
			throw new Error(`Cannot guess the price for product ${productId}`);
		}
	};
}
