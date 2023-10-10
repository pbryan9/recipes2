import { initTRPC } from '@trpc/server';
import z from 'zod';
import { getAllRecipes } from '../db/recipes/getAllRecipes';
import getAllTags from '../db/tags/getAllTags';
import createNewRecipe from '../db/recipes/createNewRecipe';
import { newRecipeFormInputSchema } from '../validators/newRecipeFormValidator';
import getRecipeById from '../db/recipes/getRecipeById';
import deleteRecipe from '../db/recipes/deleteRecipe';

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
  recipes: t.router({
    all: publicProcedure.query(async () => {
      return await getAllRecipes();
    }),
    byRecipeId: publicProcedure
      .input(z.object({ recipeId: z.string().uuid() }))
      .query(async ({ input }) => {
        return await getRecipeById(input.recipeId);
      }),
    create: publicProcedure
      .input(newRecipeFormInputSchema)
      .mutation(async ({ input }) => {
        return await createNewRecipe(input);
      }),
    delete: publicProcedure
      .input(z.object({ recipeId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        return await deleteRecipe(input.recipeId);
      }),
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
