import z from 'zod';

const newUserFormSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: 'Username must contain at least 5 characters.' }),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters.' }),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password confirmation does not match.',
    path: ['confirmPassword'],
  });

export default newUserFormSchema;
export type NewUserInput = z.infer<typeof newUserFormSchema>;
