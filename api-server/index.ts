import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/trpc';

const { API_PORT } = process.env;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({});
type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const app = express();
app.use(cors());

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({ router: appRouter, createContext })
);

app.get('/test', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.listen(API_PORT, () => {
  console.log(`Recipes API server listening at ${API_PORT}`);
});
