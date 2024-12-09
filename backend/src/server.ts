import dotenv from 'dotenv';
dotenv.config();

import express, {Express, NextFunction, Request, Response} from 'express';
import cors from 'cors';
import router from './routes';

const app: Express = express();
const port = process.env.PORT;

//middleware
app.use(express.json());
app.use(cors());
app.use(router);
//error catching middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: "Internal Server Error", error: err.message });
});

app.get('/', (req, res) => {
    res.send('pluh!')
})

app.listen(port, () => {
    console.log('pluhing on port!')
})