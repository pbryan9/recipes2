import prisma from '../prismaSingleton';

export async function getAllRecipes() {
  const allRecipes = await prisma.recipe.findMany({
    include: {
      author: true,
      ingredientGroups: { include: { ingredients: true } },
      procedureGroups: { include: { procedureSteps: true } },
      notes: true,
      tags: true,
    },
  });

  return allRecipes;
}
