import { RecoverPasswordInput } from '../../validators/recoverPasswordValidator';
import prisma from '../prismaSingleton';
import bcrypt from 'bcrypt';
import generateJwt from './generateJwt';

const VALIDITY_PERIOD = 1000 * 60 * 10; // 1000 * 60 * 10 === 10 minutes

export default async function recoverPassword({
  resetCode,
  email,
  password,
}: RecoverPasswordInput) {
  const recoveryCode = await prisma.passwordReset.findFirst({
    where: { resetCode },
    include: { user: { select: { email: true } } },
  });

  if (recoveryCode?.user.email !== email)
    throw new Error(`Invalid recovery code for email ${email}`);

  const codeIsFresh =
    Date.now() < recoveryCode.timestamp.getTime() + VALIDITY_PERIOD;

  if (!codeIsFresh) {
    throw new Error(`Recovery code ${recoveryCode.resetCode} is stale`);
  }

  const hashedPassword = await bcrypt.hash(password, 13);

  const updatedUser = await prisma.user.update({
    where: { id: recoveryCode.userId },
    data: { password: hashedPassword },
  });

  if (!updatedUser) throw new Error('Error updating user password');

  await prisma.passwordReset.deleteMany({
    where: { userId: recoveryCode.userId },
  });

  return generateJwt(recoveryCode.userId);
}
