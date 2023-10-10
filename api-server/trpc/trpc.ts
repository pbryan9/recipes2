import { initTRPC } from '@trpc/server';
import z from 'zod';
import { getAllRecipes } from '../db/recipes/getAllRecipes';
import getAllTags from '../db/tags/getAllTags';
import createNewRecipe from '../db/recipes/createNewRecipe';
import { newRecipeFormInputSchema } from '../validators/newRecipeFormValidator';

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
  createNewRecipe: publicProcedure
    .input(newRecipeFormInputSchema)
    .mutation(async ({ input }) => {
      return await createNewRecipe(input);
    }),
  getAllTags: publicProcedure.query(async () => await getAllTags()),
  sayHello: publicProcedure.query(() => {
    return { message: 'Hello, world!!!!' };
  }),
  getUser: t.procedure.input(z.string()).query((opts) => {
    opts.input; // string
    return { id: opts.input, name: 'Bilbo' };
  }),
});

export type AppRouter = typeof appRouter;
