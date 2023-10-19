import StarIcon_Filled from '../assets/icons/StarIcon_Filled';
import StarIcon_Hollow from '../assets/icons/StarIcon_Hollow';
import useUser from '../lib/hooks/useUser';
import Button from './Button';

type FavoritesButtonProps = {
  recipeId: string;
};

export default function FavoritesButton({ recipeId }: FavoritesButtonProps) {
  const { isLoggedIn, favorites, addToFavorites, removeFromFavorites } =
    useUser();

  let isFavorited = favorites.includes(recipeId);

  function handleClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();

    if (isFavorited) {
      removeFromFavorites(recipeId);
    } else {
      addToFavorites(recipeId);
    }
  }

  return (
    <Button
      onClick={handleClick}
      variant='text'
      icon={isFavorited ? <StarIcon_Filled /> : <StarIcon_Hollow />}
      // TODO: this can probably be improved
      style={{ display: isLoggedIn ? 'flex' : 'none', paddingRight: 0 }}
    />
  );
}
