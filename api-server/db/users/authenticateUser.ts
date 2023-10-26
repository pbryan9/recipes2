import { AuthenticateUserInput } from '../../validators/authenticateUserValidator';
import prisma from '../prismaSingleton';
import bcrypt from 'bcrypt';
import 'dotenv/config';

import generateJwt from './generateJwt';
import { TRPCError } from '@trpc/server';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('MISSING JWT SECRET');

export default async function authenticateUser(input: AuthenticateUserInput) {
  // pull user from db; throw error if it doesn't exist
  const user = await prisma.user.findUnique({
    where: { username: input.username },
  });
  if (!user)
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'username',
    });

  const comparePasswordResult = await bcrypt.compare(
    input.password,
    user.password
  );
  if (!comparePasswordResult)
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'password',
    });

  // return JWT containing partial user info
  return generateJwt(user.id);
}
