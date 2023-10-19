import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../prismaSingleton';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('MISSING JWT SECRET');

export default async function verifyToken(token: string) {
  const response: {
    isVerified: boolean;
    username?: string;
    userId?: string;
    error?: string;
  } = {
    isVerified: false,
  };

  if (!token) {
    response.error = 'no token provided';
    return response;
  }

  const userId = jwt.verify(token, JWT_SECRET!) as string;

  if (!userId) {
    response.error = 'token verification failed';
    return response;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    response.error = 'user not found';
    return response;
  }

  response.username = user.username;
  response.userId = userId;
  response.isVerified = true;

  return response;
}
