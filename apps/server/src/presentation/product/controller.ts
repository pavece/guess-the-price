import { z } from 'zod';
import { Request, Response } from 'express';
import { productValidationSchema } from '../../domain/validation/product.schema';
import { ProductService } from '../services/product.service';

export class ProductsController {
	private productService = new ProductService();

	public addNewProduct = (req: Request, res: Response) => {
		//TODO: Move to middleware + refine error handling
		const { product } = req.body;

		if (!product) {
			res.status(400).json({ error: 'Please include product information' });
			return;
		}

		try {
			productValidationSchema.parse(product);
		} catch (error) {
			if (error instanceof z.ZodError) {
				res.status(400).json({ error: error.issues });
				return;
			}
		}

		this.productService
			.createProduct(product)
			.then(product => res.status(201).json({ message: 'Product created', product }))
			.catch(error => res.status(500).json(error));
	};
}
