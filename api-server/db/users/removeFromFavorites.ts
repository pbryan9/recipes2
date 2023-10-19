import type { AddToFavoritesInput } from '../../validators/addToFavoritesValidator';
import prisma from '../prismaSingleton';

export default async function removeFromFavorites(
  { recipeId }: AddToFavoritesInput,
  userId: string
) {
  // same input as addToFavorites
  await prisma.user.update({
    where: { id: userId },
    data: { favorites: { disconnect: { id: recipeId } } },
  });
}
