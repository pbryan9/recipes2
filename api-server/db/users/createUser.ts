import prisma from '../prismaSingleton';
import { inferRouterInputs } from '@trpc/server';
import type { NewUserInput } from '../../validators/newUserFormValidator';
import 'dotenv/config';

import bcrypt from 'bcrypt';
import generateJwt from './generateJwt';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error('MISSING JWT SECRET');

export default async function createUser(newUserInput: NewUserInput) {
  const { username, password } = newUserInput;

  // throw error if username already exists
  const userExists = await prisma.user.findUnique({ where: { username } });
  if (userExists)
    throw new Error('Error creating new user: username already exists.');

  // hash password
  const hashedPassword = await bcrypt.hash(password, 13);

  // store user in db
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword },
    select: { id: true, username: true },
  });

  // generate token
  const token = generateJwt(newUser.id);
  return { user: newUser, token };
}
