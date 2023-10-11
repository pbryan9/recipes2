import { PrismaClient } from '@prisma/client';
import mockUserData from './mock/mockUsers.json' assert { type: 'json' };

const uomValues = [
  '',
  'oz',
  'fl. oz',
  'lb',
  'grams',
  'cup',
  'tsp',
  'tbsp',
  'bunch',
  'can',
  'box',
  'bag',
  'thing',
];

const tags = [
  {
    description: 'vegan',
    tagGroup: 'dietary',
  },
  {
    description: 'sides',
    tagGroup: 'role',
  },
  {
    description: 'korean',
    tagGroup: 'cuisine',
  },
  {
    description: 'breakfast',
    tagGroup: 'mealtime',
  },
  {
    description: 'mexican',
    tagGroup: 'cuisine',
  },
  {
    description: 'dessert',
    tagGroup: 'role',
  },
  {
    description: 'mains',
    tagGroup: 'role',
  },
];

const prisma = new PrismaClient();

export async function seed() {
  // await Promise.all([seedUsers(), seedTags()]);
  await seedTags();
  // await seedRecipes();
}

async function seedUnits() {
  await prisma.unit.createMany({
    data: uomValues.map((uom) => ({ symbol: uom })),
  });
}

export async function seedTags() {
  await prisma.tag.createMany({ data: tags });
}

export async function seedRecipes() {
  const ingredients = [
    {
      qty: 3,
      uom: 'CONTAINER',
      description: 'bullshit',
    },
    {
      description: 'however much of whatever you think',
    },
  ];

  const procedures = [
    {
      description: 'First gather all your shit.',
    },
    {
      description: 'Put all your shit in a bag.',
    },
    {
      description: 'Just get your shit together.',
      timer: 60 * 30,
    },
    {
      description: 'Fin!',
    },
  ];

  // const tags = await prisma.tag.findMany();

  await prisma.user.update({
    where: {
      username: 'pattyb',
    },
    data: {
      recipes: {
        create: {
          title: 'Test Recipe',
          cookTime: 30,
          notes: {
            create: {
              description: 'This is a top-level note.',
            },
          },
          ingredientGroups: {
            create: {
              ingredients: {
                createMany: {
                  data: [
                    {
                      qty: 3,
                      description: 'bullshit',
                    },
                    {
                      description: 'however much of whatever you think',
                    },
                  ],
                },
              },
            },
          },
          procedureGroups: {
            create: {
              procedureSteps: {
                createMany: {
                  data: [
                    {
                      description: 'First gather all your shit.',
                    },
                    {
                      description: 'Put all your shit in a bag.',
                    },
                    {
                      description: 'Get your shit together.',
                      timer: 60 * 30,
                    },
                    {
                      description: 'Fin!',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function seedUsers() {
  await prisma.user.createMany({ data: mockUserData });
}

seed()
  .catch((e) => console.log(e))
  .finally(async () => await prisma.$disconnect());
