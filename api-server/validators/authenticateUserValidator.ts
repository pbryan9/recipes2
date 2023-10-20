import z from 'zod';

const authenticateUserValidator = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export default authenticateUserValidator;
export type AuthenticateUserInput = z.infer<typeof authenticateUserValidator>;
