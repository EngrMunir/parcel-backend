import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors({
    origin:['http://localhost:5173'],
    credentials: true
}));

app.use('/api',router)

app.get('/', (req:Request, res:Response) => {
  res.send('Courier API is running!');
});

export default app;
