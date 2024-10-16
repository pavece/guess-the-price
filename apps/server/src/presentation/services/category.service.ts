import { PrismaClient } from '@prisma/client';
import { ControllerError } from '../../domain/errors/controller-error';

export class CategoryService {
	private prisma = new PrismaClient();

	public createNewCategory = async (name: string, id?: string) => {
		try {
			return await this.prisma.category.create({ data: { name, id } });
		} catch (error) {
			console.error(error);
			throw new ControllerError(`Could not create new category ${name}`, 500);
		}
	};
}
