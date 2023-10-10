import LeftNav from '../../components/LeftNav';
import SectionHeader from '../../components/SectionHeader';
import StandardMainContainer from '../../components/StandardMainContainer';
import SearchCard from '../../components/SearchCard';

import RecipeCard from '../../components/RecipeCard';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import { useContext } from 'react';
import { RecipesContext } from '../../utils/context/RecipesContextProvider';
import { RecipesState } from '../../utils/hooks/useRecipes';

export default function BrowseRecipes() {
  const recipesContext = useContext(RecipesContext);

  function presentFilteredResults(
    filteredRecipes: Record<string, FilledRecipe[]>
  ) {
    const headingMap: Record<string, string> = {
      titleMatches: 'Title Matches',
      tagMatches: 'Tag Matches',
      ingredientMatches: 'Ingredient Matches',
      procedureMatches: 'Procedure Matches',
    };

    let results = [];

    for (let heading in headingMap) {
      if (filteredRecipes && filteredRecipes[heading]!.length > 0)
        results.push(
          <section
            key={heading}
            className='border border-gray-400 rounded-md p-4 w-full flex flex-col gap-4'
          >
            <h2 className='text-3xl font-bold'>{headingMap[heading]}</h2>
            {filteredRecipes[heading]!.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </section>
        );
    }

    return results;
  }

  function presentRecipes(recipesState: RecipesState) {
    if (!recipesState) return;

    const {
      allRecipes,
      titleMatches,
      ingredientMatches,
      procedureMatches,
      tagMatches,
      searchTerm,
    } = recipesState;

    if (searchTerm === '') {
      return (
        <section className='border border-gray-400 rounded-md p-4 w-full flex flex-col gap-4'>
          <h2 className='text-3xl font-bold'>All Recipes</h2>
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      );
    } else
      return presentFilteredResults({
        titleMatches,
        ingredientMatches,
        procedureMatches,
        tagMatches,
      });
  }

  return (
    <>
      <SectionHeader sectionTitle='Recipes' />
      <section className='min-h-[calc(100vh_-_80px_-_128px)] h-full flex justify-between items-start w-full'>
        <LeftNav>
          <SearchCard />
        </LeftNav>
        <StandardMainContainer>
          <div className='w-full flex flex-col gap-4'>
            {!recipesContext.isLoading && presentRecipes(recipesContext)}
          </div>
        </StandardMainContainer>
      </section>
    </>
  );
}
