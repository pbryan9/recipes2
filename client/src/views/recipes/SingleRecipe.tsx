import { useContext, useMemo } from 'react';

import SectionHeader from '../../components/SectionHeader';

import { RecipesContext } from '../../utils/context/RecipesContextProvider';
import { useParams } from 'react-router-dom';
import LeftNav from '../../components/LeftNav';
import LeftNavCard from '../../components/LeftNavCard';
import StandardMainContainer from '../../components/StandardMainContainer';

type SingleRecipeProps = {};

export default function SingleRecipe({}: SingleRecipeProps) {
  const { recipeId } = useParams();

  const recipesContext = useContext(RecipesContext);

  function getRecipeFromContext(recipeId: string) {
    if (!recipeId) return;

    return recipesContext.allRecipes.find((recipe) => recipe.id === recipeId);
  }

  const recipe = useMemo(
    () => getRecipeFromContext(recipeId || ''),
    [recipeId]
  );

  return (
    <>
      <SectionHeader sectionTitle={recipe?.title || 'Viewing Recipe'} />
      <section className='flex justify-between items-start h-[calc(100vh_-_80px_-_128px)] overflow-y-hidden w-full'>
        <LeftNav>
          <h2 className='text-4xl'>Ingredients</h2>
          {recipe?.ingredientGroups.map((group) => (
            <article
              key={group.id}
              className='w-full h-fit flex flex-col gap-0 mb-4'
            >
              {group.groupTitle !== '' && (
                <h3 className='text-3xl self-start font-bold text-gray-800 px-4'>
                  {group.groupTitle}
                </h3>
              )}
              {group.ingredients.map((item) => (
                <LeftNavCard key={item.id}>
                  {[item.qty, item.uom, item.description].join(' ')}
                </LeftNavCard>
              ))}
            </article>
          ))}
        </LeftNav>
        <StandardMainContainer>
          {recipe?.procedureGroups.map((group, idx) => (
            <article
              key={group.id}
              className='w-full h-fit flex flex-col justify-start items-center gap-4 mb-6 p-4 border border-gray-400 rounded-md'
            >
              {group.groupTitle !== '' && (
                <h2 className='text-3xl self-end font-bold'>
                  {group.groupTitle}
                </h2>
              )}
              {recipe?.procedureGroups[idx].procedureSteps.map((step) => (
                <div
                  key={step.id}
                  className='text-xl w-full text-white bg-gray-800 flex justify-start items-center p-6 rounded-md'
                >
                  <p>{step.description}</p>
                </div>
              ))}
            </article>
          ))}
        </StandardMainContainer>
      </section>
    </>
  );
}
