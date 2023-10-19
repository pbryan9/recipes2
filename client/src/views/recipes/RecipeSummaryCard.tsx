import { type FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import StarIcon_Filled from '../../assets/icons/StarIcon_Filled';
import useUser from '../../lib/hooks/useUser';

type RecipeSummaryCardProps = {
  recipe: FilledRecipe;
  onClick: () => void;
  isSelected?: boolean;
};

// TODO: selected card should be highlighted

export default function RecipeSummaryCard({
  recipe,
  onClick,
  isSelected = false,
}: RecipeSummaryCardProps) {
  const { favorites } = useUser();

  const isFavorited = favorites.includes(recipe.id);

  return (
    <article
      onClick={onClick}
      className={`rounded-sm pl-4 gap-4 pr-6 flex items-center justify-between w-full h-[72px] shrink-0 cursor-pointer ${
        isSelected ? 'bg-white/10' : 'bg-surface-container hover:bg-white/5'
      }`}
    >
      <div className='flex items-center gap-4 w-full overflow-x-hidden'>
        <div className='w-10 aspect-square rounded-full flex items-center justify-center primary-container on-primary-container-text title-large shrink-0'>
          {recipe.author.username[0].toUpperCase()}
        </div>
        <div className='flex flex-col justify-center items-start overflow-hidden'>
          <h2 className='title-medium on-surface-text w-full overflow-hidden text-ellipsis whitespace-nowrap'>
            {recipe.title}
          </h2>
          {recipe.tags.length > 0 && (
            <p className='title-small on-surface-variant-text whitespace-nowrap text-ellipsis overflow-hidden'>
              {recipe.tags.map((tag) => tag.description).join(', ')}
            </p>
          )}
        </div>
      </div>
      {isFavorited && <StarIcon_Filled />}
    </article>
  );
}
