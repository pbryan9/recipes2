import { Link } from 'react-router-dom';
import TagBadge from './TagBadge';
import type { FilledRecipe } from '../../../api-server/db/recipes/getRecipeById';

type RecipeCardProps = {
  recipe: FilledRecipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const {
    title,
    author: { username: author },
  } = recipe;

  return (
    <Link
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
