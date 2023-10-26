import prisma from '../prismaSingleton';
import bcrypt from 'bcrypt';

import { type ResetPasswordInput } from '../../validators/resetPasswordValidator';
import generateJwt from './generateJwt';

export default async function resetPassword({
  email,
  newPassword,
}: ResetPasswordInput) {
  const userToUpdate = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!userToUpdate) throw new Error(`User with email ${email} does not exist`);

  const hashedPassword = await bcrypt.hash(newPassword, 13);
  const updatedUser = await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { password: hashedPassword },
  });

  if (!updatedUser) throw new Error('Error updating user password');

  return generateJwt(updatedUser.id);
}
