import prisma from '../prismaSingleton';

export async function getAllRecipes() {
  const allRecipes = await prisma.recipe.findMany({
    include: {
      author: { select: { id: true, username: true, avatarColor: true } },
      ingredientGroups: { include: { ingredients: true } },
      procedureGroups: { include: { procedureSteps: true } },
      notes: true,
      tags: true,
    },
  });

  return allRecipes;
}
