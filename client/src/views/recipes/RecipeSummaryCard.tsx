import { type FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';

type RecipeSummaryCard = {
  recipe: FilledRecipe;
  onClick: () => void;
};

// TODO: add star icon
// TODO: click to update main pane
// TODO: selected card should be highlighted
// TODO: hovered card should be highlighted

export default function RecipeSummaryCard({
  recipe,
  onClick,
}: RecipeSummaryCard) {
  return (
    <article
      onClick={onClick}
      className='rounded-sm shadow-level1 pl-4 gap-4 pr-6 flex items-center w-full h-[72px] shrink-0 bg-surface-container hover:bg-white/5 cursor-pointer'
    >
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
    </article>
  );
}
