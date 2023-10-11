import { Link, useNavigate, useParams } from 'react-router-dom';

import { trpc } from '../../utils/trpc';

import SectionHeader from '../../components/SectionHeader';
import LeftNav from '../../components/LeftNav';
import LeftNavCard from '../../components/LeftNavCard';
import StandardMainContainer from '../../components/StandardMainContainer';

export default function SingleRecipe() {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const { recipeId } = useParams();

  const deleteRecipe = trpc.recipes.delete.useMutation({
    onSuccess: (opt) => {
      console.log('opt:', opt);
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId });
      utils.recipes.all.prefetch(undefined, { staleTime: 1000 * 60 * 1 });
      navigate('/recipes');
    },
  });

  if (!recipeId) navigate('/recipes');

  const recipe = trpc.recipes.byRecipeId.useQuery(
    { recipeId: recipeId! },
    { staleTime: 1000 * 60 * 10 }
  );

  if (recipe.isLoading) return <h1>Loading...</h1>;
  if (recipe.isError) return <h1>Error</h1>;

  return (
    <>
      <SectionHeader>
        <div className='flex flex-col items-end justify-center'>
          {recipe.data?.title || 'Viewing Recipe'}
          <Link
            className='text-sm -translate-y-full'
            to={`/recipes/${recipeId}/edit`}
          >
            Edit
          </Link>
        </div>
      </SectionHeader>
      <section className='flex justify-between items-start h-[calc(100vh_-_80px_-_128px)] overflow-y-hidden w-full'>
        <LeftNav>
          <h2 className='text-4xl'>Ingredients</h2>
          {recipe.data?.ingredientGroups.map((group) => (
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
          <Link to={`/recipes/${recipeId}/edit`}>
            <LeftNavCard variant='caution'>Edit Recipe</LeftNavCard>
          </Link>
          <LeftNavCard
            variant='danger'
            onClick={() => deleteRecipe.mutate({ recipeId: recipeId! })}
          >
            {deleteRecipe.isLoading ? 'Deleting recipe...' : 'Delete Recipe'}
          </LeftNavCard>
        </LeftNav>
        <StandardMainContainer>
          {recipe.data?.procedureGroups.map((group, idx) => (
            <article
              key={group.id}
              className='w-full h-fit flex flex-col justify-start items-center gap-4 mb-6 p-4 border border-gray-400 rounded-md'
            >
              {group.groupTitle !== '' && (
                <h2 className='text-3xl self-end font-bold'>
                  {group.groupTitle}
                </h2>
              )}
              {recipe.data?.procedureGroups[idx].procedureSteps.map((step) => (
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
