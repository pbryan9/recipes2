import prisma from '../prismaSingleton';

export default async function deleteRecipe(recipeId: string) {
  const [ingredientGroups, procedureGroups] = await Promise.all([
    prisma.ingredientGroup.findMany({
      where: { recipeId },
    }),
    prisma.procedureGroup.findMany({
      where: { recipeId },
    }),
  ]);

  const deleteIngredients = prisma.ingredient.deleteMany({
    where: {
      ingredientGroupId: { in: ingredientGroups.map((group) => group.id) },
    },
  });

  const deleteIngredientGroups = prisma.ingredientGroup.deleteMany({
    where: { recipeId },
  });

  const deleteProcedures = prisma.procedureStep.deleteMany({
    where: {
      procedureGroupId: { in: procedureGroups.map((group) => group.id) },
    },
  });

  const deleteProcedureGroups = prisma.procedureGroup.deleteMany({
    where: { recipeId },
  });

  const deleteRecipe = prisma.recipe.delete({ where: { id: recipeId } });

  await prisma.$transaction([
    deleteIngredients,
    deleteIngredientGroups,
    deleteProcedures,
    deleteProcedureGroups,
    deleteRecipe,
  ]);

  return { message: `Recipe ${recipeId} deleted` };
}
