import path from 'path';
import fs from 'fs/promises';
import prisma from '../../db/prismaSingleton';

import bcrypt from 'bcrypt';

const DIRNAME = path.join('prisma', 'seed', 'stored-data');

type StoredProcedureStep = {
  description: string;
  timer: number | null;
};

type StoredProcedureGroup = {
  groupTitle: string;
  description: string | null;
  recipeId: string;
  procedureSteps: StoredProcedureStep[];
};

type StoredIngredient = {
  qty: string | null;
  description: string;
  uom: string | null;
};

type StoredIngredientGroup = {
  groupTitle: string;
  description: string | null;
  recipeId: string;
  ingredients: StoredIngredient[];
};

type StoredNote = {
  description: string;
  recipeId: string;
};

type StoredRecipe = {
  id: string;
  title: string;
  notes: StoredNote[];
  tags: { description: string }[];
  prepTime: string | null;
  cookTime: string | null;
  authorId: string;
  author: {
    username: string;
  };
  ingredientGroups: StoredIngredientGroup[];
  procedureGroups: StoredProcedureGroup[];
};

type StoredFavorite = {
  id: string;
};

type StoredUser = {
  username: string;
  email: string;
  password: string;
  avatarColor: string;
  favorites: StoredFavorite[];
};

type StoredTag = {
  id?: string;
  description: string;
  tagGroup?: string;
};

function readData(absoluteFilename: string) {
  if (!path.isAbsolute(absoluteFilename))
    throw new Error('Error: must provide absolute file path');

  return fs.readFile(absoluteFilename, { encoding: 'utf-8' });
}

async function restoreUserData() {
  let absPath = path.resolve(DIRNAME, 'users.json');

  const data = JSON.parse(await readData(absPath));

  let tempPassword = await bcrypt.hash('welcome123', 13);

  let newUsers = await prisma.user.createMany({
    data: data.map((storedUser: StoredUser) => ({
      username: storedUser.username,
      email: storedUser.email,
      avatarColor: storedUser.avatarColor,
      password: storedUser.password || tempPassword,
    })),
  });

  console.log({ newUsers });
}

async function restoreTagData() {
  let absPath = path.resolve(DIRNAME, 'tags.json');

  const data = JSON.parse(await readData(absPath));

  let newTags = await prisma.tag.createMany({
    data: data.map((tag: StoredTag) => ({
      description: tag.description,
      tagGroup: tag.tagGroup,
    })),
  });

  console.log({ newTags });
}

async function restoreRecipeData() {
  let absPath = path.resolve(DIRNAME, 'recipes.json');

  const data: StoredRecipe[] = JSON.parse(await readData(absPath));

  let queries = [];

  for (let recipe of data) {
    const newRecipe = await prisma.recipe.create({
      data: {
        title: recipe.title,
        author: {
          connect: {
            username: recipe.author.username,
          },
        },
        cookTime: recipe.cookTime,
        prepTime: recipe.prepTime,
        notes: {
          createMany: {
            data: recipe.notes.map((note) => ({
              description: note.description,
            })),
          },
        },
        ingredientGroups: {
          create: {
            description: recipe.ingredientGroups[0].description,
            groupTitle: recipe.ingredientGroups[0].groupTitle,
            ingredients: {
              createMany: {
                data: recipe.ingredientGroups[0].ingredients.map((ing) => ({
                  qty: ing.qty,
                  description: ing.description,
                  uom: ing.uom,
                })),
              },
            },
          },
        },
        procedureGroups: {
          create: {
            description: recipe.procedureGroups[0].description,
            groupTitle: recipe.procedureGroups[0].groupTitle,
            procedureSteps: {
              createMany: {
                data: recipe.procedureGroups[0].procedureSteps.map((step) => ({
                  description: step.description,
                  timer: step.timer,
                })),
              },
            },
          },
        },
      },
    });

    if (recipe.ingredientGroups.length > 1) {
      for (let group of recipe.ingredientGroups.slice(1)) {
        const createGroupQuery = prisma.recipe.update({
          where: {
            id: newRecipe.id,
          },
          data: {
            ingredientGroups: {
              create: {
                description: group.description,
                groupTitle: group.groupTitle,
                ingredients: {
                  createMany: {
                    data: group.ingredients.map((ing) => ({
                      description: ing.description,
                      qty: ing.qty,
                      uom: ing.uom,
                    })),
                  },
                },
              },
            },
          },
        });

        queries.push(createGroupQuery);
      }
    }

    if (recipe.procedureGroups.length > 1) {
      for (let group of recipe.procedureGroups.slice(1)) {
        const createGroupQuery = prisma.recipe.update({
          where: {
            id: newRecipe.id,
          },
          data: {
            procedureGroups: {
              create: {
                description: group.description,
                groupTitle: group.groupTitle,
                procedureSteps: {
                  createMany: {
                    data: group.procedureSteps.map((step) => ({
                      description: step.description,
                      timer: step.timer,
                    })),
                  },
                },
              },
            },
          },
        });

        queries.push(createGroupQuery);
      }
    }

    for (let tag of recipe.tags) {
      const connectTagQuery = prisma.recipe.update({
        where: {
          id: newRecipe.id,
        },
        data: {
          tags: {
            connect: { description: tag.description },
          },
        },
      });

      queries.push(connectTagQuery);
    }
  }

  await prisma.$transaction(queries);
}

console.time();

main();

console.timeEnd();

function main() {
  Promise.all([restoreUserData(), restoreTagData()]).then(() =>
    restoreRecipeData()
  );
}
