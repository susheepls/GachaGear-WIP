import express, {Express} from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('pluh!')
})

app.listen(port, () => {
    console.log('pluhing on port!')
})