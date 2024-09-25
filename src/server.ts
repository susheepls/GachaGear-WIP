import express, {Express} from 'express';
import cors from 'cors';
import router from './routes';

const app: Express = express();
const port = 3000;

//middleware
app.use(express.json());
app.use(cors());
app.use(router);

app.get('/', (req, res) => {
    res.send('pluh!')
})

app.listen(port, () => {
    console.log('pluhing on port!')
})