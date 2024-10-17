import { PrismaClient } from '@prisma/client';
import { ControllerError } from '../../domain/errors/controller-error';
import { checkControllerError } from '../../domain/errors/handle-controller-error';

const MAX_PRICE_DIFF = 1.5;

export class RandomService {
	private prisma = new PrismaClient();

	public getRandomProduct = async (ignore: string[], category?: string) => {
		try {
			const productCount = await this.prisma.product.count({
				where: { id: { notIn: ignore }, categoryId: category },
			});

			if (!productCount) {
				throw new ControllerError("Couldn't find any product.", 404);
			}

			const randomProduct = await this.prisma.product.findMany({
				orderBy: { id: 'desc' },
				where: { id: { notIn: ignore }, categoryId: category },
				skip: Math.random() * productCount,
				take: 1,
				select: {
					id: true,
					name: true,
					description: true,
					image: true,
					source: true,
					price: true,
					priceMessage: true,
					category: {
						select: {
							name: true,
						},
					},
				},
			});

			if (!randomProduct.length) {
				throw new ControllerError("Couldn't find any product.", 404);
			}

			const { price, ...rest } = randomProduct[0];
			return { ...rest, price: Number(price) };
		} catch (error) {
			console.error(error);
			checkControllerError(error as Error, 'Could not get random product');
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
			checkControllerError(error as Error, 'Could not get random product high low');
		}
	};
}
