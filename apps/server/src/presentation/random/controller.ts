import { Response, Request } from 'express';

export class RandomController {
	public getRandomProduct = (req: Request, res: Response) => {
		res.json({ msg: 'Get a random product' });
	};
}
