import { PrismaClient } from '@prisma/client';

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

			return randomProduct;
		} catch (error) {
			console.log(error);

			throw new Error('Cannot get random product');
		}
	};
}
