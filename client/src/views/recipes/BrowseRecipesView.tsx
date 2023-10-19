import { useSearchParams } from 'react-router-dom';
import IngredientsSection from './IngredientsSection';
import RecipeSummaryCard from './RecipeSummaryCard';
import SearchCard from './SearchCard';
import ProcedureSection from './ProcedureSection';
import useRecipes from '../../lib/hooks/useRecipesNew';
import React, { useState } from 'react';
import Button from '../create-recipe/_components/Button';
import CollapseIcon from '../../assets/icons/CollapseIcon';
import ExpandIcon from '../../assets/icons/ExpandIcon';
import { FilterResult } from '../../lib/context/RecipesContextProviderNew';
import StarIcon_Hollow from '../../assets/icons/StarIcon_Hollow';
import useUser from '../../lib/hooks/useUser';
import StarIcon_Filled from '../../assets/icons/StarIcon_Filled';

export default function BrowseRecipesView() {
  const [expanded, setExpanded] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, filterResults, filterIsActive } = useRecipes();
  const { isLoggedIn, removeFromFavorites, addToFavorites, favorites } =
    useUser();

  const selectedRecipeId = searchParams.get('selectedRecipeId');
  const activeRecipe =
    recipes?.find(({ id }) => id === selectedRecipeId) || null;

  document.title = activeRecipe?.title || 'Browsing Recipes';

  if (!recipes) return <h1>hang on...</h1>;

  return (
    <div className='w-full flex items-start justify-stretch gap-6 overflow-y-hidden h-full'>
      <section
        className={`shrink-0 transition-all ease-in-out duration-300 flex overflow-y-hidden h-full flex-col items-center justify-start gap-6 pt-4 print:hidden ${
          expanded ? 'shrink w-0' : 'w-[360px]'
        }`}
      >
        <SearchCard />
        <div className='flex flex-col justify-start items-stretch gap-2 overflow-y-auto w-full'>
          {filterIsActive
            ? renderFilterResults(filterResults)
            : recipes.map((recipe) => (
                <RecipeSummaryCard
                  key={recipe.id}
                  recipe={recipe}
                  isSelected={selectedRecipeId === recipe.id}
                  onClick={() =>
                    setSearchParams({ selectedRecipeId: recipe.id })
                  }
                />
              ))}
        </div>
      </section>

      <main className='w-full overflow-hidden h-full flex flex-col gap-4'>
        {activeRecipe && (
          <>
            <header className='h-fit w-full shrink-0 flex justify-between items-center gap-6'>
              <div className='flex gap-4 items-center overflow-hidden'>
                <Button
                  icon={expanded ? <CollapseIcon /> : <ExpandIcon />}
                  variant='text'
                  rotate={true}
                  onClick={() => setExpanded((prev) => !prev)}
                ></Button>
                <h1 className='display-large text-on-surface whitespace-nowrap text-ellipsis overflow-x-hidden'>
                  {activeRecipe!.title}
                </h1>
              </div>
              {isLoggedIn && (
                <Button
                  onClick={() =>
                    favorites.includes(activeRecipe.id)
                      ? removeFromFavorites(activeRecipe.id)
                      : addToFavorites(activeRecipe.id)
                  }
                  variant='text'
                  icon={
                    favorites.includes(activeRecipe.id) ? (
                      <StarIcon_Filled />
                    ) : (
                      <StarIcon_Hollow />
                    )
                  }
                />
              )}
            </header>
            <div
              className={`overflow-y-auto w-full flex gap-6 group ${
                expanded ? 'expanded' : 'flex-col'
              }`}
            >
              <IngredientsSection recipe={activeRecipe!} />
              <ProcedureSection recipe={activeRecipe!} />
            </div>
          </>
        )}
      </main>
    </div>
  );

  function renderFilterResults(filterResults: FilterResult) {
    const captionMap: Record<keyof FilterResult, string> = {
      titleMatches: 'Title Matches',
      authorMatches: 'Author Matches',
      ingredientMatches: 'Ingredient Matches',
      procedureMatches: 'Procedure Matches',
      tagMatches: 'Tag Matches',
    };

    return Object.keys(filterResults).map((groupName) => (
      <React.Fragment key={groupName}>
        {filterResults[groupName as keyof FilterResult].length > 0 && (
          <h2 className='title-medium mt-6 first:mt-0'>
            {captionMap[groupName as keyof FilterResult]}
          </h2>
        )}
        {filterResults[groupName as keyof FilterResult].map((recipe) => (
          <RecipeSummaryCard
            key={recipe.id}
            recipe={recipe}
            isSelected={selectedRecipeId === recipe.id}
            onClick={() => setSearchParams({ selectedRecipeId: recipe.id })}
          />
        ))}
      </React.Fragment>
    ));
  }
}