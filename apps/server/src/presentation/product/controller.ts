import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';

export class ProductsController {
	private productService = new ProductService();

	public addNewProduct = (req: Request, res: Response) => {
		const { product } = req.body;

		this.productService
			.createProduct(product)
			.then(product => res.status(201).json({ message: 'Product created', product }))
			.catch(error => res.status(500).json(error));
	};
}
