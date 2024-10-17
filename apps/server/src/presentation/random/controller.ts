import { Response, Request } from 'express';
import { RandomService } from '../services/random.service';
import { ControllerError } from '../../domain/errors/controller-error';

export class RandomController {
	private randomService = new RandomService();

	public getRandomProduct = (req: Request, res: Response) => {
		let { ignores } = req.body;

		if (!ignores || !Array.isArray(ignores)) {
			ignores = [];
		}

		this.randomService
			.getRandomProduct(ignores, req.body.category)
			.then(product => res.status(200).json(product))
			.catch((error: ControllerError) => {
				res.status(error.code).json({ error: error.message });
			});
	};

	public getRandomProductHighLow = (req: Request, res: Response) => {
		let { ignores } = req.body;
		const { current } = req.body;

		if (!ignores || !Array.isArray(ignores)) {
			ignores = [];
		}

		this.randomService
			.getRandomProductHighLow(current ?? '', ignores)
			.then(product => res.json(product))
			.catch((error: ControllerError) => {
				res.status(error.code).json({ error: error.message });
			});
	};
}
