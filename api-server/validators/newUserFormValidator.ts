import z from 'zod';

const newUserFormValidator = z
  .object({
    username: z
      .string()
      .min(5, { message: 'Username must contain at least 5 characters.' }),
    email: z.string().email({ message: 'Valid email address is required.' }),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters.' }),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password confirmation does not match.',
    path: ['confirmPassword'],
  });

export default newUserFormValidator;
export type NewUserInput = z.infer<typeof newUserFormValidator>;
