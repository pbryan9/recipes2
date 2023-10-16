import { useEffect, useState } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import IngredientsSection from './IngredientsSection';
import RecipeSummaryCard from './RecipeSummaryCard';
import SearchCard from './SearchCard';
import ProcedureSection from './ProcedureSection';
import useRecipes from '../../lib/hooks/useRecipesNew';

export default function BrowseRecipesView() {
  const [activeRecipe, setActiveRecipe] = useState<FilledRecipe | null>(null);

  const { recipes } = useRecipes();

  useEffect(() => {
    if (recipes && !activeRecipe) setActiveRecipe(recipes[0]);
  }, [recipes]);

  if (!recipes) return <h1>hang on...</h1>;

  return (
    <div className='w-full flex items-start justify-stretch gap-6 overflow-y-hidden h-full'>
      <section className='w-[360px] shrink-0 flex h-full overflow-auto flex-col items-center justify-start gap-6'>
        <SearchCard />
        <div className='flex flex-col items-stretch gap-2 h-full overflow-y-auto w-full'>
          {recipes.map((recipe) => (
            <RecipeSummaryCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setActiveRecipe(recipe)}
            />
          ))}
        </div>
      </section>

      <main className='w-full overflow-hidden h-full flex flex-col'>
        {activeRecipe && (
          <>
            <header className='h-fit w-full shrink-0'>
              <h1 className='display-large w-full text-on-surface whitespace-nowrap text-ellipsis overflow-x-hidden'>
                {activeRecipe!.title}
              </h1>
            </header>
            <div className='overflow-y-auto flex flex-col gap-6 justify-stretch'>
              <IngredientsSection recipe={activeRecipe!} />
              <ProcedureSection recipe={activeRecipe!} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
