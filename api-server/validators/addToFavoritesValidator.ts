import { z } from 'zod';

const addToFavoritesValidator = z.object({
  // userId: z.string().uuid(),
  recipeId: z.string().uuid(),
});

export type AddToFavoritesInput = z.infer<typeof addToFavoritesValidator>;

export default addToFavoritesValidator;
