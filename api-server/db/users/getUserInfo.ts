import prisma from '../prismaSingleton';

export default async function getUserInfo(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      avatarColor: true,
      favorites: { select: { id: true } },
    },
  });

  if (!user)
    throw new Error(`User with id ${userId} was not found in database.`);

  return user;
}
