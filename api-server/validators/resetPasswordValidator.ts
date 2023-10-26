import z from 'zod';

const resetPasswordValidator = z
  .object({
    oldPassword: z.string(),
    newPassword: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(
    ({ newPassword, confirmPassword }) => {
      return newPassword === confirmPassword;
    },
    {
      message: 'Password confirmation does not match',
      path: ['confirmPassword'],
    }
  );

export default resetPasswordValidator;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidator>;
