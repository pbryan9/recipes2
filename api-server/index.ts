import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config';

import { trpcMiddleware } from './trpc/trpc';

const { API_PORT, ALLOWED_ORIGINS, NODEMAILER_USER, NODEMAILER_PASS } =
  process.env;

const allowedOrigins = ALLOWED_ORIGINS?.split('|');

const app = express();
app.use(morgan('dev'));
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use('/api', trpcMiddleware);

app.listen(API_PORT, () => {
  console.log(`Recipes API server listening at ${API_PORT}`);
  console.log(`Allowing CORS traffic from ${allowedOrigins?.join(' & ')}`);
});
