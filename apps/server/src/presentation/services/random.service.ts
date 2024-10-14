import { PrismaClient } from '@prisma/client';
import { ControllerError } from '../../domain/errors/controller-error';

const MAX_PRICE_DIFF = 1.5;

export class RandomService {
	private prisma = new PrismaClient();

	public getRandomProduct = async (ignore: string[]) => {
		try {
			const productCount = await this.prisma.product.count({ where: { id: { notIn: ignore } } });

			const randomProduct = await this.prisma.product.findMany({
				where: { id: { notIn: ignore } },
				skip: Math.random() * productCount,
				take: 1,
				orderBy: { id: 'desc' },
			});

			return randomProduct[0];
		} catch (error) {
			console.log(error);

			throw new Error('Cannot get random product');
		}
	};

	public getRandomProductHighLow = async (currentProductId: string, ignore: string[]) => {
		try {
			const products = [];

			// First product
			products[0] = await this.prisma.product.findUnique({ where: { id: currentProductId } });

			if (!products[0]) {
				products[0] = await this.getRandomProduct(ignore);
			}

			if (!products[0]) {
				throw new ControllerError('Could not find any product', 404);
			}

			// Second product
			const limitedProductCount = await this.prisma.product.count({
				where: {
					id: { notIn: [...ignore, products[0].id] },
					price: { lte: Number(products[0].price) + MAX_PRICE_DIFF, gte: Number(products[0].price) - MAX_PRICE_DIFF },
				},
			});

			if (limitedProductCount == 0) {
				products[1] = await this.getRandomProduct([...ignore, products[0].id]);
				return products;
			}

			products[1] = await this.prisma.product.findFirst({
				where: {
					id: { notIn: [...ignore, products[0].id] },
					price: { lte: Number(products[0].price) + MAX_PRICE_DIFF, gte: Number(products[0].price) - MAX_PRICE_DIFF },
				},
				skip: Math.random() * limitedProductCount,
				orderBy: { id: 'desc' },
			});

			return products;
		} catch (error) {
			console.error(error);

			if (error instanceof ControllerError) {
				throw error;
			}

			throw new ControllerError('Could not get random product high low', 500);
		}
	};
}
