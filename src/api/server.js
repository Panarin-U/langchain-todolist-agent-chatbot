import express from 'express';
import { config as dotenvConfig } from 'dotenv';
import apiRouter from './index.js';

dotenvConfig();

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// API routes
app.use('/api', apiRouter);

const port = process.env.API_PORT || 3001;
app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
