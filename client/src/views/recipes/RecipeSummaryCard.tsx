import { useMemo } from 'react';
import { type FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import FavoritesButton from '../../components/FavoritesButton';
import { calculateLabelColor } from '../../lib/utils';

type RecipeSummaryCardProps = {
  recipe: FilledRecipe;
  onClick: () => void;
  isSelected?: boolean;
};

export default function RecipeSummaryCard({
  recipe,
  onClick,
  isSelected = false,
}: RecipeSummaryCardProps) {
  const labelColor = useMemo(
    () => calculateLabelColor(recipe.author.avatarColor || '#3A4D00'),
    [recipe.author.avatarColor]
  );

  return (
    <article
      onClick={onClick}
      className={`rounded-sm pl-4 gap-4 pr-6 flex items-center justify-between w-full h-[72px] shrink-0 cursor-pointer ${
        isSelected ? 'bg-white/10' : 'bg-surface-container hover:bg-white/5'
      }`}
    >
      <div className='flex items-center gap-4 w-full overflow-x-hidden'>
        <div
          className='w-10 aspect-square rounded-full flex items-center justify-center on-primary-container-text title-large shrink-0'
          style={{
            backgroundColor: recipe.author.avatarColor || '#3A4D00',
            color: labelColor,
          }}
        >
          {recipe.author.username[0].toUpperCase()}
        </div>
        <div className='flex flex-col justify-center items-start overflow-hidden'>
          <h2 className='title-medium on-surface-text w-full overflow-hidden text-ellipsis whitespace-nowrap'>
            {recipe.title}
          </h2>
          {recipe.tags.length > 0 && (
            <p className='title-small on-surface-variant-text whitespace-nowrap text-ellipsis overflow-hidden w-full'>
              {recipe.tags.map((tag) => tag.description).join(', ')}
            </p>
          )}
        </div>
      </div>
      <FavoritesButton recipeId={recipe.id} />
    </article>
  );
}
