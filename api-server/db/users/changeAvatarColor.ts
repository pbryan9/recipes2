import { type AvColorChangeInput } from '../../validators/changeAvatarColorValidator';
import prisma from '../prismaSingleton';

export default async function changeAvatarColor({
  userId,
  colorCode,
}: AvColorChangeInput & { userId: string }) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { avatarColor: colorCode },
    });

    return {
      success: `User id ${userId} successfully updated to ${colorCode} color.`,
    };
  } catch (err) {
    return { error: `User with id ${userId} not found.` };
  }
}
