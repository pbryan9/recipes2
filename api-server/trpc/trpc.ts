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
import newUserFormValidator from '../validators/newUserFormValidator';
import createUser from '../db/users/createUser';
import authenticateUserValidator from '../validators/authenticateUserValidator';
import authenticateUser from '../db/users/authenticateUser';
import verifyToken from '../db/users/verifyToken';
import newTagFormValidator from '../validators/newTagFormValidator';
import createNewTag from '../db/tags/createNewTag';
import addToFavoritesValidator from '../validators/addToFavoritesValidator';
import addToFavorites from '../db/users/addToFavorites';
import removeFromFavorites from '../db/users/removeFromFavorites';
import getUserInfo from '../db/users/getUserInfo';
import changeAvatarColorValidator from '../validators/changeAvatarColorValidator';
import changeAvatarColor from '../db/users/changeAvatarColor';
import sendPasswordReset from '../db/users/sendPasswordReset';
import recoverPasswordValidator from '../validators/recoverPasswordValidator';
import recoverPassword from '../db/users/recoverPassword';
import resetPasswordValidator from '../validators/resetPasswordValidator';
import resetPassword from '../db/users/resetPassword';

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
      .input(newUserFormValidator)
      .mutation(async ({ input }) => {
        return await createUser(input);
      }),

    changeAvatarColor: protectedProcedure
      .input(changeAvatarColorValidator)
      .mutation(async ({ input, ctx }) => {
        return await changeAvatarColor({
          colorCode: input.colorCode,
          userId: ctx.user.userId!,
        });
      }),

    authenticateUser: publicProcedure
      .input(authenticateUserValidator)
      .mutation(async ({ input }) => {
        return await authenticateUser(input);
      }),

    validateToken: protectedProcedure.query(({ ctx }) => {
      return ctx.user.username;
    }),

    getUserInfo: protectedProcedure.query(
      async ({
        ctx: {
          user: { userId },
        },
      }) => {
        return await getUserInfo(userId!);
      }
    ),

    addToFavorites: protectedProcedure.input(addToFavoritesValidator).mutation(
      async ({
        input: { recipeId },
        ctx: {
          user: { userId },
        },
      }) => await addToFavorites({ recipeId }, userId!)
    ),

    removeFromFavorites: protectedProcedure
      .input(addToFavoritesValidator)
      .mutation(
        async ({
          input: { recipeId },
          ctx: {
            user: { userId },
          },
        }) => await removeFromFavorites({ recipeId }, userId!)
      ),

    requestRecoveryCode: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input: { email } }) => {
        return await sendPasswordReset({ email });
      }),

    attemptPasswordRecovery: publicProcedure
      .input(recoverPasswordValidator)
      .mutation(async ({ input: inputArgs }) => {
        return await recoverPassword(inputArgs);
      }),

    resetPassword: protectedProcedure.input(resetPasswordValidator).mutation(
      async ({
        input: inputArgs,
        ctx: {
          user: { userId },
        },
      }) => {
        return await resetPassword(inputArgs, userId!);
      }
    ),
  }),
  tags: t.router({
    all: publicProcedure.query(async () => await getAllTags()),

    create: protectedProcedure
      .input(newTagFormValidator)
      .mutation(async ({ input }) => {
        return await createNewTag(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});
