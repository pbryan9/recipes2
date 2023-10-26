import prisma from '../prismaSingleton';
import bcrypt from 'bcrypt';

import { type ResetPasswordInput } from '../../validators/resetPasswordValidator';
import generateJwt from './generateJwt';

export default async function resetPassword(
  newPassword: string,
  userId: string
) {
  const hashedPassword = await bcrypt.hash(newPassword, 13);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  if (!updatedUser) throw new Error('Error updating user password');

  return generateJwt(updatedUser.id);
}
