import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { JWTPayload } from './types';
import { connectToDatabase } from './data/db';

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const app = express();
const port = process.env.PORT || 5000;

connectToDatabase()
  .then(() => {
    console.log('MongoDB connection established');
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    console.log('Continuing with local data only');
  });

app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

// Start the server in development, but not when deployed to Vercel
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export the Express app for Vercel
export default app; 