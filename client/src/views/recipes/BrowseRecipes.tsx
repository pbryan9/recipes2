import LeftNav from '../../components/LeftNav';
import SectionHeader from '../../components/SectionHeader';
import StandardMainContainer from '../../components/StandardMainContainer';
import SearchCard from '../../components/SearchCard';

import useBrowseRecipes from '../../utils/hooks/useBrowseRecipes';
import RecipeCard from '../../components/RecipeCard';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';

export default function BrowseRecipes() {
  const { filteredRecipes, isLoading, searchTerm, setSearchTerm } =
    useBrowseRecipes();

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

  function presentRecipes(filteredRecipes: Record<string, FilledRecipe[]>) {
    if (!filteredRecipes) return;

    const { allRecipes } = filteredRecipes;

    console.log('allrecipes', allRecipes);
    console.log('filtered recipes', filteredRecipes);

    if (allRecipes.length > 0) {
      return (
        <section className='border border-gray-400 rounded-md p-4 w-full flex flex-col gap-4'>
          <h2 className='text-3xl font-bold'>All Recipes</h2>
          {allRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </section>
      );
    } else return presentFilteredResults(filteredRecipes);
  }

  return (
    <>
      <SectionHeader sectionTitle='Recipes' />
      <section className='min-h-[calc(100vh_-_80px_-_128px)] h-full flex justify-between items-start w-full'>
        <LeftNav>
          <SearchCard {...{ searchTerm, setSearchTerm }} />
        </LeftNav>
        <StandardMainContainer>
          <div className='w-full flex flex-col gap-4'>
            {isLoading ? <h1>LOADING</h1> : presentRecipes(filteredRecipes)}
          </div>
        </StandardMainContainer>
      </section>
    </>
  );
}
