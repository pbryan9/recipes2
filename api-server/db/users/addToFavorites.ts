import type { AddToFavoritesInput } from '../../validators/addToFavoritesValidator';
import prisma from '../prismaSingleton';

export default async function addToFavorites(
  { recipeId }: AddToFavoritesInput,
  userId: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: { favorites: {connect: {id: recipeId}}},
  });

}
