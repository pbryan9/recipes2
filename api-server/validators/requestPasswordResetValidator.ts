import z from 'zod';

const requestPasswordResetValidator = z.object({
  email: z.string().email(),
});

export default requestPasswordResetValidator;
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetValidator
>;
