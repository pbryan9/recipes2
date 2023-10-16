import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { newRecipeFormInputSchema } from '../../../../api-server/validators/newRecipeFormValidator';

import SectionHeader from '../../components/SectionHeader';
import StandardMainContainer from '../../components/StandardMainContainer';
import CreateSideMenu from './_components/Create_SideMenu';
import { Tag } from '../../../../api-server/db/tags/getAllTags';
import { RouterInputs, trpc } from '../../lib/trpc/trpc';
import GroupsListing from './_components/GroupsListing';
import SelectedTags from './_components/SelectedTags';
import useUser from '../../lib/hooks/useUser';

const defaultValues: RouterInputs['recipes']['create'] = {
  title: '',
  author: undefined,
  cookTime: '' as unknown as undefined,
  prepTime: '' as unknown as undefined,
  ingredientGroups: [
    {
      groupTitle: '',
      description: '',
      ingredients: [
        {
          qty: undefined,
          uom: undefined,
          description: '',
        },
      ],
    },
  ],
  procedureGroups: [
    {
      groupTitle: '',
      description: '',
      procedureSteps: [
        {
          description: '',
          timer: undefined,
        },
      ],
    },
  ],
};

const inputClasses = 'col-span-6 rounded-md h-full text-gray-900 px-4';
const labelClasses = 'col-span-2';

export default function CreateRecipeView() {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const { isLoggedIn, username } = useUser();

  useEffect(() => {
    // cannot create recipes if not logged in
    if (!isLoggedIn) navigate('/sign-in');
  }, [isLoggedIn]);

  const mutation = trpc.recipes.create.useMutation({
    onSuccess: (data) => {
      utils.recipes.all.invalidate();
      if (data?.id)
        utils.recipes.byRecipeId.prefetch(
          { recipeId: data.id },
          { staleTime: 1000 * 60 * 10 }
        );
      navigate(`/recipes/${data!.id}`);
    },
    meta: {},
  });

  const [selectedTags, setSelectedTags] = useState<Map<string, Tag>>();

  const { register, handleSubmit, control, reset } = useForm<
    RouterInputs['recipes']['create']
  >({
    defaultValues,
    resolver: zodResolver(newRecipeFormInputSchema),
  });

  // package up the form submission to make it easier to pass to side nav
  const submitForm = handleSubmit(onSubmit);

  function resetForm() {
    setSelectedTags(undefined);
    reset(defaultValues);
  }

  function toggleTag(tag: Tag) {
    let tempTags = new Map(selectedTags);

    if (tempTags.has(tag.id)) tempTags.delete(tag.id);
    else tempTags.set(tag.id, tag);

    setSelectedTags(tempTags);
  }

  async function onSubmit(data: RouterInputs['recipes']['create']) {
    data.author = username!;

    if (selectedTags?.size && selectedTags.size > 0) {
      data.tags = Array.from(selectedTags.values()) as typeof data.tags;
    }

    mutation.mutate(data);
  }

  return (
    <div className='flex flex-col w-full h-full'>
      <header className='w-full flex justify-between items-center'>
        <h1 className='display-medium'>New Recipe</h1>
        <button>Save</button>
      </header>
      <main className='flex justify-stretch items-start w-full gap-6'>
        <CreateSideMenu
          {...{ resetForm, submitForm, toggleTag, selectedTags }}
        />
        <StandardMainContainer>
          <form className='flex flex-col items-start text-2xl font-bold gap-y-4 w-full h-fit min-h-full'>
            <section className='col-span-8 grid grid-cols-8 auto-rows-[56px] gap-y-4 self-start w-full items-center'>
              <label htmlFor='title' className={labelClasses + ' text-4xl'}>
                Recipe Title
              </label>
              <input
                type='text'
                id='title'
                {...register('title')}
                className={inputClasses}
              />
              {selectedTags && selectedTags.size > 0 && (
                <SelectedTags
                  removeSelectedTag={toggleTag}
                  selectedTags={selectedTags}
                />
              )}
              <label htmlFor='prepTime' className={labelClasses}>
                Prep Time
              </label>
              <input
                type='text'
                id='prepTime'
                {...register('prepTime')}
                className={inputClasses}
              />
              <label htmlFor='cookTime' className={labelClasses}>
                Cook Time
              </label>
              <input
                type='text'
                id='cookTime'
                {...register('cookTime')}
                className={inputClasses}
              />
            </section>

            <section
              id='ingredients-section'
              className='col-span-8 grid grid-cols-8 auto-rows-[56px] gap-y-4 self-start w-full items-center border border-gray-400 rounded-md p-4'
            >
              <h2 className='col-span-full text-4xl'>Ingredients</h2>
              <GroupsListing
                {...{ control, register, groupType: 'ingredientGroups' }}
              />
            </section>

            <section
              id='procedure-section'
              className='col-span-8 grid grid-cols-8 auto-rows-[56px] gap-y-4 self-start w-full items-center border border-gray-400 rounded-md p-4'
            >
              <h2 className='col-span-full text-4xl'>Procedure</h2>
              <GroupsListing
                {...{ control, register, groupType: 'procedureGroups' }}
              />
            </section>
          </form>
        </StandardMainContainer>
      </main>
    </div>
  );
}
