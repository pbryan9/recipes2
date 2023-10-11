import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import { trpcMiddleware } from './trpc/trpc';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';

const { API_PORT, ALLOWED_ORIGINS } = process.env;

const allowedOrigins = ALLOWED_ORIGINS?.split('|');

const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(ClerkExpressWithAuth({}));

app.use('/api', trpcMiddleware);

app.listen(API_PORT, () => {
  console.log(`Recipes API server listening at ${API_PORT}`);
  console.log(`Allowing CORS traffic from ${allowedOrigins?.join(' & ')}`);
});
