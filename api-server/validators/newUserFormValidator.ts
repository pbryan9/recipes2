import z from 'zod';

const newUserFormSchema = z
  .object({
    username: z.string().min(5),
    password: z
      .string()
      .min(8, { message: 'Password must contain at least 8 characters.' }),
    confirmPassword: z.string().min(8),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Password confirmation does not match.',
  });

export default newUserFormSchema;
export type NewUserInput = z.infer<typeof newUserFormSchema>;
