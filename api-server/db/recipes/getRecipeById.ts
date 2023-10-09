import { Prisma } from '@prisma/client';
import prisma from '../prismaSingleton';

export type FilledRecipe = Prisma.RecipeGetPayload<{
  include: {
    author: true;
    ingredientGroups: { include: { ingredients: true } };
    procedureGroups: { include: { procedureSteps: true } };
    notes: true;
    tags: true;
  };
}>;

export type Ingredient = Prisma.IngredientGetPayload<{}>;
export type ProcedureStep = Prisma.ProcedureStepGetPayload<{}>;

export default async function getRecipeById(id: string) {
  return await prisma.recipe.findUnique({
    where: { id },
    include: {
      author: true,
      ingredientGroups: { include: { ingredients: true } },
      procedureGroups: { include: { procedureSteps: true } },
      notes: true,
      tags: true,
    },
  });
}
