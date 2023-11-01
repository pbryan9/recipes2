import z from 'zod';

const shareRecipeValidator = z.object({
  toEmail: z.string().email('Must enter a valid email address.'),
  recipeId: z.string().uuid('Must provide valid recipe ID.'),
});

export default shareRecipeValidator;
export type ShareRecipeInput = z.infer<typeof shareRecipeValidator>;
