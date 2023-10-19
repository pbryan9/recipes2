import { Prisma } from '@prisma/client';
import prisma from '../prismaSingleton';

const include = {
  author: { select: { username: true, id: true } },
  ingredientGroups: { include: { ingredients: true } },
  procedureGroups: { include: { procedureSteps: true } },
  notes: true,
  tags: true,
};

export type FilledRecipe = Prisma.RecipeGetPayload<{
  include: typeof include;
}>;

export type Ingredient = Prisma.IngredientGetPayload<{}>;
export type ProcedureStep = Prisma.ProcedureStepGetPayload<{}>;

export default async function getRecipeById(id: string) {
  return await prisma.recipe.findUnique({
    where: { id },
    include,
  });
}
