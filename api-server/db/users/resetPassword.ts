import prisma from '../prismaSingleton';
import bcrypt from 'bcrypt';

import generateJwt from './generateJwt';
import { ResetPasswordInput } from '../../validators/resetPasswordValidator';
import { TRPCError } from '@trpc/server';

export default async function resetPassword(
  { oldPassword, newPassword }: ResetPasswordInput,
  userId: string
) {
  // look up logged-in user & pull existing (hashed) password
  const passwordCheck = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!passwordCheck)
    throw new TRPCError({ code: 'NOT_FOUND', message: 'userId' });

  // compare passed-in old password with hashed version from db
  const verifyOldPassword = await bcrypt.compare(
    oldPassword,
    passwordCheck?.password
  );

  if (verifyOldPassword === false) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'oldPassword' });
  }

  // hash new password & update db
  const hashedPassword = await bcrypt.hash(newPassword, 13);
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  if (!updatedUser)
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error updating user password',
    });

  // return new token
  return generateJwt(updatedUser.id);
}
