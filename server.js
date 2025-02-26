import express from 'express'

const port = process.env.PORT || 3000;

import { router } from './routes/api.js';
const app = express()
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
