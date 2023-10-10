import z from 'zod';
// import { stringToNumber } from '../helpers/numberToString';

const uomValues = [
  '',
  'OZ',
  'FLOZ',
  'LB',
  'G',
  'C',
  'TSP',
  'TBSP',
  'BUNCH',
  'CAN',
  'BAG',
  'CONTAINER',
  'OTHER',
] as const;

const ingredientGroupSchema = z
  .object({
    groupTitle: z.string(),
    description: z.string().optional(),
    ingredients: z
      .object({
        // qty: z.number().positive().optional(),
        qty: z.coerce.number().nullable().optional(),
        uom: z.enum(uomValues).optional(),
        description: z
          .string()
          .min(1, { message: 'Description cannot be blank.' }),
      })
      .array()
      .nonempty({ message: 'Group must contain at least 1 ingredient.' }),
  })
  .array()
  .nonempty({ message: 'Must contain at least 1 set of ingredients.' });

const procedureGroupSchema = z
  .object({
    groupTitle: z.string(),
    description: z.string().optional(),
    procedureSteps: z
      .object({
        description: z
          .string()
          .min(1, { message: 'Description cannot be blank.' }),
        timer: z.number().positive().int().optional(),
      })
      .array(),
  })
  .array()
  .nonempty({ message: 'Must contain at least one set of steps.' });

const tagsSchema = z
  .object({
    description: z.string(),
    tagGroup: z.string().optional(),
    id: z.string().optional(),
  })
  .array()
  .optional();

const newRecipeFormInputSchema = z
  .object({
    title: z.string().min(1, { message: 'Recipe must have a title.' }),
    author: z.string().min(1, { message: 'Username is missing.' }).optional(),
    prepTime: z.coerce.number().optional(),
    cookTime: z.coerce.number().optional(),
    ingredientGroups: ingredientGroupSchema,
    procedureGroups: procedureGroupSchema,
    tags: tagsSchema,
  })
  .refine(({ ingredientGroups }) => refineGroupTitle(ingredientGroups), {
    message: 'Ingredient group labels must be unique.',
    path: ['ingredientGroups.0.groupTitle'],
  })
  .refine(({ procedureGroups }) => refineGroupTitle(procedureGroups), {
    message: 'Procedure group labels must be unique.',
    path: ['procedureGroups.0.groupTitle'],
  });

function refineGroupTitle(group: IngredientGroup | ProcedureGroup) {
  if (group.length === 1) return true;

  let seenTitles = new Set();

  for (let member of group) {
    if (seenTitles.has(member.groupTitle)) {
      return false;
    } else seenTitles.add(member.groupTitle);
  }

  return true;
}

export { newRecipeFormInputSchema, uomValues };
export type FormInputs = z.infer<typeof newRecipeFormInputSchema>;
type IngredientGroup = z.infer<typeof ingredientGroupSchema>;
type ProcedureGroup = z.infer<typeof procedureGroupSchema>;
export type tagSchema = z.infer<typeof tagsSchema>;
