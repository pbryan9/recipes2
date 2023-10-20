import z from 'zod';

const changeAvatarColorValidator = z.object({
  colorCode: z
    .string()
    .regex(/^#[0-F]{6}$/gi, 'Invalid color code: must provide full hex code.'),
});

export type AvColorChangeInput = z.infer<typeof changeAvatarColorValidator>;
export default changeAvatarColorValidator;
