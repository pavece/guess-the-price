import express from 'express';
import 'dotenv/config';

const app = express();

app.get('/', (req, res) => {
	res.json({ msg: 'Backend running' });
});

app.listen(process.env.PORT, () => {
	console.log(`Server listening on port ${process.env.PORT}`);
});
