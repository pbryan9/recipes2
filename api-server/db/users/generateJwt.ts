import jwt from 'jsonwebtoken';

import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('MISSING JWT SECRET');

export default function generateJwt(userId: string) {
  if (!userId) throw new Error('No user ID provided.');

  return jwt.sign(userId, JWT_SECRET!);
}
