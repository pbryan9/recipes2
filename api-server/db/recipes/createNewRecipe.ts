import prisma from '../prismaSingleton';
import {
  type FormInputs,
  newRecipeFormInputSchema,
} from '../../validators/newRecipeFormValidator';

export default async function createNewRecipe(formInputs: FormInputs) {
  // * note: zod validation is called by tRPC before invoking this function - we can assume clean data here

  // remove unused optionals from create object
  if (!formInputs.cookTime) delete formInputs.cookTime;
  if (!formInputs.prepTime) delete formInputs.prepTime;
  if (!formInputs.tags?.length) delete formInputs.tags;

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
    // create initial recipe (ingredient/procedure groups at [0] only since we cannot nest createMany calls)

    let newRecipe = await prisma.recipe.create({
      data: {
        title: formInputs.title,
        cookTime: formInputs.cookTime,
        prepTime: formInputs.prepTime,
        author: {
          connectOrCreate: {
            // TODO: derive user ID or username
            where: {
              username: formInputs.author,
            },
            create: {
              username: formInputs.author || 'anonymous',
            },
          },
        },
        tags: {},
        ingredientGroups: {
          create: {
            groupTitle: formInputs.ingredientGroups[0].groupTitle || undefined,
            description:
              formInputs.ingredientGroups[0].description || undefined,
            ingredients: {
              createMany: {
                data: formInputs.ingredientGroups[0].ingredients,
              },
            },
          },
        },
        procedureGroups: {
          create: {
            groupTitle: formInputs.procedureGroups[0].groupTitle || undefined,
            description: formInputs.procedureGroups[0].description || undefined,
            procedureSteps: {
              createMany: {
                data: formInputs.procedureGroups[0].procedureSteps,
              },
            },
          },
        },
      },
    });

    // now circle back & append any additional ingredient/procedure groups

    // use a flag to indicate whether we should re-fetch the recipe before returning it

    console.log('initial recipe created');

    for (let group of formInputs.ingredientGroups.slice(1)) {
      console.log('adding an ingredient group');
      // TODO: there may be a group.createMany angle on this, since I know the recipeId & therefore don't need to nest-create
      // await prisma.ingredientGroup.create({
      //   data: {
      //     recipeId: newRecipe.id
      //   }
      // })

      await prisma.recipe.update({
        where: { id: newRecipe.id },
        data: {
          ingredientGroups: {
            create: {
              description: group.description,
              groupTitle: group.groupTitle,
              ingredients: {
                createMany: {
                  data: group.ingredients,
                },
              },
            },
          },
        },
      });
    }

    for (let group of formInputs.procedureGroups.slice(1)) {
      console.log('adding a proc group');
      await prisma.recipe.update({
        where: { id: newRecipe.id },
        data: {
          procedureGroups: {
            create: {
              description: group.description,
              groupTitle: group.groupTitle,
              procedureSteps: {
                createMany: {
                  data: group.procedureSteps,
                },
              },
            },
          },
        },
      });
    }

    // create/connect tags to recipe
    if (formInputs.tags)
      await prisma.recipe.update({
        where: {
          id: newRecipe.id,
        },
        data: {
          tags: {
            connect: formInputs.tags!.map((tag) => ({ id: tag.id })),
          },
        },
      });

    console.log('fetching final recipe');

    const finalRecipe = await prisma.recipe.findUnique({
      where: { id: newRecipe.id },
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

    return finalRecipe;
  } catch (err) {
    console.log('error creating new recipe');
    console.log(err);
  }
}
