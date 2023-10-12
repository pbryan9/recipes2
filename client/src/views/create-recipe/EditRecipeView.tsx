import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { newRecipeFormInputSchema } from '../../../../api-server/validators/newRecipeFormValidator';
import type { RouterInputs } from '../../utils/trpc/trpc';

import SectionHeader from '../../components/SectionHeader';
import StandardMainContainer from '../../components/StandardMainContainer';
import CreateSideMenu from './_components/Create_SideMenu';
import { Tag } from '../../../../api-server/db/tags/getAllTags';
import { trpc } from '../../utils/trpc/trpc';
import GroupsListing from './_components/GroupsListing';
import SelectedTags from './_components/SelectedTags';
import useUser from '../../utils/hooks/useUser';

const defaultValues: RouterInputs['recipes']['edit'] = {
  title: '',
  recipeId: '',
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

export default function EditRecipeView() {
  const { recipeId } = useParams();

  const navigate = useNavigate();
  const { isLoggedIn, username } = useUser();

  const utils = trpc.useContext();

  const [selectedTags, setSelectedTags] = useState<Map<string, Tag>>();

  const recipe = trpc.recipes.byRecipeId.useQuery({ recipeId: recipeId! });

  useEffect(() => {
    // check to make sure we're the owner of this recipe; if not get out
    if (!isLoggedIn) navigate(`/recipes/${recipeId}`);

    const recipeAuthor = recipe.data?.author.username;
    if (recipeAuthor && recipeAuthor !== username)
      navigate(`/recipes/${recipeId}`);
  }, [isLoggedIn, username, recipe.data?.author.username]);

  const defaultFormValues = {
    author: recipe.data?.author.username,
    cookTime: recipe.data?.cookTime || undefined,
    prepTime: recipe.data?.prepTime || undefined,
    title: recipe.data?.title,
    tags: recipe.data?.tags.map((tag) => ({
      id: tag.id,
      description: tag.description,
      tagGroup: tag.tagGroup || undefined,
    })),
    procedureGroups: recipe.data?.procedureGroups.map((group) => ({
      groupTitle: group.groupTitle,
      description: group.description || undefined,
      procedureSteps: group.procedureSteps.map((step) => ({
        description: step.description || undefined,
        timer: step.timer || undefined,
      })),
    })),
    ingredientGroups: recipe.data?.ingredientGroups.map((group) => ({
      description: group.description || undefined,
      groupTitle: group.groupTitle,
      ingredients: group.ingredients.map(({ description, qty, uom }) => ({
        description: description,
        qty: qty || undefined,
        uom: (uom || '') as any,
      })),
    })),
  };

  useEffect(() => {
    if (!recipe.isLoading && !recipe.isError) {
      setSelectedTags(new Map(recipe.data?.tags.map((tag) => [tag.id, tag])));
      reset(defaultFormValues);
    }
  }, [recipe.isLoading, recipe.isError]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RouterInputs['recipes']['create']>({
    defaultValues: defaultFormValues || defaultValues,
    resolver: zodResolver(newRecipeFormInputSchema),
  });

  const mutation = trpc.recipes.edit.useMutation({
    onSuccess: (data) => {
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId });
      if (data?.id)
        utils.recipes.byRecipeId.prefetch(
          { recipeId: data.id },
          { staleTime: 1000 * 60 * 10 }
        );
      navigate(`/recipes/${data!.id}`);
    },
  });

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
    // TODO: fix this
    data.author = username!;

    if (selectedTags?.size && selectedTags.size > 0) {
      data.tags = Array.from(selectedTags.values()) as typeof data.tags;
    }

    mutation.mutate({ ...data, recipeId: recipeId! });
  }

  return (
    <>
      <SectionHeader>{`Editing ${recipe.data?.title}`}</SectionHeader>
      <section className='flex justify-between items-start h-[calc(100vh_-_80px_-_128px)] overflow-y-hidden w-full'>
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
      </section>
    </>
  );
}
