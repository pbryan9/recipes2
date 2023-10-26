import z from 'zod';

const recoverPasswordValidator = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, 'Password must contain at least 8 characters.'),
    confirmPassword: z.string().min(8),
    resetCode: z.coerce
      .number()
      .gte(100000, '6-digit number expected')
      .lte(999999, '6-digit number expected'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password confirmation does not match.',
    path: ['confirmPassword'],
  });

export default recoverPasswordValidator;
export type RecoverPasswordInput = z.infer<typeof recoverPasswordValidator>;
