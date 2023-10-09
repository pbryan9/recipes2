import { initTRPC } from '@trpc/server';
import z from 'zod';
import { getAllRecipes } from '../db/recipes/getAllRecipes';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const publicProcedure = t.procedure;

export const appRouter = t.router({
  getAllRecipes: publicProcedure.query(async () => {
    return await getAllRecipes();
  }),
  sayHello: publicProcedure.query(() => {
    return { message: 'Hello, world!!!!' };
  }),
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input; // string
    return { id: opts.input, name: 'Bilbo' };
  }),
});

export type AppRouter = typeof appRouter;
