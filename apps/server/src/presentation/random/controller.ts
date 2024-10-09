import { Response, Request } from 'express';
import { RandomService } from '../services/random.service';

export class RandomController {
	private randomService = new RandomService();

	public getRandomProduct = async (req: Request, res: Response) => {
		let { ignores } = req.body;

		if (!ignores || !Array.isArray(ignores)) {
			ignores = [];
		}

		this.randomService
			.getRandomProduct(ignores)
			.then(product => res.status(200).json(product))
			.catch(error => res.status(500).json({ error }));
	};
}
