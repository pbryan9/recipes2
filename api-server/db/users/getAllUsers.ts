import prisma from '../prismaSingleton';

export default async function getAllUsers() {
  const users = await prisma.user.findMany({ include: { favorites: true } });

  return users;
}
