import prisma from '../prismaSingleton';
import {
  type FormInputs,
  newRecipeFormInputSchema,
} from '../../validators/newRecipeFormValidator';

export default async function editRecipe(
  formInputs: FormInputs & { recipeId: string }
) {
  // * note: zod validation is called by tRPC before invoking this function - we can assume clean data here
  let recipeToEdit = await prisma.recipe.findUnique({
    where: { id: formInputs.recipeId },
    include: {
      tags: true,
    },
  });

  if (!recipeToEdit) throw new Error('Recipe not found.');

  // remove unused optionals from edit payload (but only if existing recipe matches)
  if (!formInputs.cookTime && !recipeToEdit.cookTime)
    delete formInputs.cookTime;
  if (!formInputs.prepTime && !recipeToEdit.cookTime)
    delete formInputs.prepTime;
  if (!formInputs.tags?.length && !recipeToEdit.tags?.length)
    delete formInputs.tags;

  for (let group of formInputs.ingredientGroups) {
    if (!group.description) delete group.description;

    for (let ing of group.ingredients) {
      if (!ing.uom) delete ing.uom;
      if (!ing.qty) delete ing.qty;
    }
  }

  for (let group of formInputs.procedureGroups) {
    if (!group.description) delete group.description;

    for (let step of group.procedureSteps) {
      if (!step.timer) delete step.timer;
    }
  }

  try {
    // delete ingredients & groups from existing recipe (easier to just recreate them all)
    const [ingGroupsToDelete, procGroupsToDelete] = await Promise.all([
      prisma.ingredientGroup.findMany({
        where: { recipeId: formInputs.recipeId },
        include: { ingredients: true },
      }),
      prisma.procedureGroup.findMany({
        where: { recipeId: formInputs.recipeId },
        include: { procedureSteps: true },
      }),
    ]);

    // group all the little changes into an array for prisma.$transaction
    const transactionQueries = [];

    const deleteIngredients = prisma.ingredient.deleteMany({
      where: {
        ingredientGroupId: { in: ingGroupsToDelete.map((group) => group.id) },
      },
    });
    transactionQueries.push(deleteIngredients);

    const deleteProcedures = prisma.procedureStep.deleteMany({
      where: {
        procedureGroupId: { in: procGroupsToDelete.map((group) => group.id) },
      },
    });
    transactionQueries.push(deleteProcedures);

    const deleteIngGroups = prisma.ingredientGroup.deleteMany({
      where: { id: { in: ingGroupsToDelete.map((group) => group.id) } },
    });
    transactionQueries.push(deleteIngGroups);

    const deleteProcGroups = prisma.procedureGroup.deleteMany({
      where: { id: { in: procGroupsToDelete.map((group) => group.id) } },
    });
    transactionQueries.push(deleteProcGroups);

    // set tags to passed-in list

    const removeTags = prisma.recipe.update({
      where: { id: formInputs.recipeId },
      data: { tags: { set: [] } },
    });
    transactionQueries.push(removeTags);

    if (formInputs.tags?.length ?? 0 > 0) {
      const addTags = prisma.recipe.update({
        where: { id: formInputs.recipeId },
        data: {
          tags: {
            connect: [...formInputs.tags!.map((tag) => ({ id: tag.id! }))],
          },
        },
      });
      transactionQueries.push(addTags);
    }

    // add back passed-in ingredient/procedure groups

    for (let group of formInputs.ingredientGroups) {
      const createGroup = prisma.ingredientGroup.create({
        data: {
          description: group.description || '',
          groupTitle: group.groupTitle || '',
          recipeId: formInputs.recipeId,
          ingredients: {
            createMany: {
              data: group.ingredients,
            },
          },
        },
      });

      transactionQueries.push(createGroup);
    }

    for (let group of formInputs.procedureGroups) {
      const createGroup = prisma.procedureGroup.create({
        data: {
          description: group.description || '',
          groupTitle: group.groupTitle || '',
          recipeId: formInputs.recipeId,
          procedureSteps: {
            createMany: {
              data: group.procedureSteps,
            },
          },
        },
      });

      transactionQueries.push(createGroup);
    }

    // update top-level recipe info
    const updateRecipe = prisma.recipe.update({
      where: { id: formInputs.recipeId },
      data: {
        title: formInputs.title,
        cookTime: formInputs.cookTime,
        prepTime: formInputs.prepTime,
      },
    });
    transactionQueries.push(updateRecipe);

    // execute transaction
    const transactionResult = await prisma.$transaction(transactionQueries);

    console.log('transaction result:');
    console.dir(transactionResult, { depth: 5 });

    const editedRecipe = await prisma.recipe.findUnique({
      where: { id: formInputs.recipeId },
      include: {
        author: true,
        tags: true,
        ingredientGroups: {
          include: {
            ingredients: true,
          },
        },
        procedureGroups: {
          include: {
            procedureSteps: true,
          },
        },
      },
    });

    return editedRecipe;
  } catch (err) {
    console.log('error creating new recipe');
    console.log(err);
  }
}
