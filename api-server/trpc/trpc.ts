import { type inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
import { getAllRecipes } from '../db/recipes/getAllRecipes';
import getAllTags from '../db/tags/getAllTags';
import createNewRecipe from '../db/recipes/createNewRecipe';
import { newRecipeFormInputSchema } from '../validators/newRecipeFormValidator';
import getRecipeById from '../db/recipes/getRecipeById';
import deleteRecipe from '../db/recipes/deleteRecipe';
import editRecipe from '../db/recipes/editRecipe';

import 'dotenv/config';

import z from 'zod';
import newUserFormSchema from '../validators/newUserFormValidator';
import createUser from '../db/users/createUser';
import authenticateUserValidator from '../validators/authenticateUserValidator';
import authenticateUser from '../db/users/authenticateUser';
import verifyToken from '../db/users/verifyToken';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

export const createContext = async ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => {
  const token = req.headers.authorization?.split(' ').at(-1);

  return { req, res, token };
};

type TRPCContext = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<TRPCContext>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */

const isAuthed = t.middleware(async (opts) => {
  const token = opts.ctx.token;

  if (!token) throw new TRPCError({ code: 'UNAUTHORIZED' });

  try {
    const authRes = await verifyToken(token);
    return opts.next({ ctx: { user: authRes } });
  } catch (err) {
    console.log(err);
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

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
    create: protectedProcedure
      .input(newRecipeFormInputSchema)
      .mutation(async ({ input }) => {
        return await createNewRecipe(input);
      }),
    edit: protectedProcedure
      .input(
        newRecipeFormInputSchema.and(z.object({ recipeId: z.string().uuid() }))
      )
      .mutation(async ({ input }) => {
        return await editRecipe(input);
      }),
    delete: protectedProcedure
      .input(z.object({ recipeId: z.string().uuid() }))
      .mutation(async ({ input }) => {
        return await deleteRecipe(input.recipeId);
      }),
  }),
  users: t.router({
    create: publicProcedure
      .input(newUserFormSchema)
      .mutation(async ({ input }) => {
        console.log('attempting user create');
        return await createUser(input);
      }),
    authenticateUser: publicProcedure
      .input(authenticateUserValidator)
      .mutation(async ({ input }) => {
        return await authenticateUser(input);
      }),
    validateToken: protectedProcedure.query(({ ctx }) => {
      return ctx.user.username;
    }),
  }),
  getAllTags: publicProcedure.query(async () => await getAllTags()),
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});
