import { z } from 'zod';

const newTagFormValidator = z.object({
  tagName: z
    .string()
    .min(3, { message: 'Tag name must contain at least 3 characters.' }),
  tagGroup: z.string().optional(),
});

export default newTagFormValidator;
export type NewTagInput = z.infer<typeof newTagFormValidator>;
