import express from 'express'

const port = process.env.PORT || 3000;
import { router } from './routes/api.js';
import cors from 'cors';

const app = express()
app.use(cors());
app.use(express.json());
app.use('/api', router)

app.get('/', (req, res) => {
    res.send('Express server is running');
});

app.get('/route', (req, res) => {
    res.send('Express server is running in route');
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
