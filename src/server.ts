import express, {Express} from 'express';
import cors from 'cors';

const app: Express = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('pluh!')
})

app.listen(port, () => {
    console.log('pluhing on port!')
})