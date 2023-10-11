import z from 'zod';

const authenticateUserValidator = z.object({
  username: z.string(),
  password: z.string(),
});

export default authenticateUserValidator;
export type AuthenticateUserInput = z.infer<typeof authenticateUserValidator>;
