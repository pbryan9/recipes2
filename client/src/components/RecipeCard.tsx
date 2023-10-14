import { Link } from 'react-router-dom';
import TagBadge from './TagBadge';
import { trpc, type RouterOutputs } from '../lib/trpc/trpc';

type RecipeCardProps = {
  recipe: RouterOutputs['recipes']['byRecipeId'];
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const utils = trpc.useContext();

  if (!recipe) return <h1>Error: no recipe provided</h1>;

  const {
    title,
    author: { username: author },
  } = recipe;

  return (
    <Link
      onMouseOver={() =>
        utils.recipes.byRecipeId.prefetch(
          { recipeId: recipe.id },
          { staleTime: 1000 * 60 * 1 }
        )
      }
      to={`/recipes/${recipe.id}`}
      className='recipe-card w-full h-32 flex items-center flex-shrink-0 justify-between border border-gray-400 rounded-md p-6'
      aria-label={recipe.title}
    >
      <div className='flex flex-col items-start basis-3/4 justify-center h-full'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        {author && <aside className='text-xs'>by {author}</aside>}
      </div>
      <div className='flex items-center justify-end h-full basis-1/4 flex-wrap gap-y-2 gap-x-4'>
        {recipe.tags?.length! > 0 &&
          recipe.tags!.map((tag) => (
            <TagBadge key={tag.description}>{tag.description}</TagBadge>
          ))}
      </div>
    </Link>
  );
}
