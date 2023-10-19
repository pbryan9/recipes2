import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { newRecipeFormInputSchema } from '../../../../api-server/validators/newRecipeFormValidator';

import FormLeftPane from './_components/FormLeftPane';
import { Tag } from '../../../../api-server/db/tags/getAllTags';
import { RouterInputs, trpc } from '../../lib/trpc/trpc';
import useUser from '../../lib/hooks/useUser';
import FormInput from './_components/FormInput';
import IngredientsSection from './_components/IngredientsSection';
import ProcedureSection from './_components/ProcedureSection';
import Button from '../../components/Button';
import SaveIcon from '../../assets/icons/SaveIcon';
import useRecipes from '../../lib/hooks/useRecipes';

type FormInput = RouterInputs['recipes']['create'];

export default function CreateRecipeView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const utils = trpc.useContext();
  const [selectedTags, setSelectedTags] = useState<Map<string, Tag>>();
  const { isLoggedIn, isLoading, username } = useUser();
  const { recipes } = useRecipes();

  const recipeId = searchParams.get('recipeId');
  const recipe = recipeId ? recipes.find(({ id }) => id === recipeId) : null;

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate('/sign-in');
  }, [isLoading, isLoggedIn]);

  const createMutation = trpc.recipes.create.useMutation({
    onSuccess: (data) => {
      utils.recipes.all.invalidate();
      if (data?.id)
        utils.recipes.byRecipeId.prefetch(
          { recipeId: data.id },
          { staleTime: 1000 * 60 * 10 }
        );
      navigate(`/recipes?recipeId=${data!.id}`);
    },
  });

  const editMutation = trpc.recipes.edit.useMutation({
    onSuccess() {
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId: recipeId! });
      navigate(`/recipes?recipeId=${recipeId}`);
    },
  });

  const defaultFormValues: FormInput = {
    title: recipe?.title || '',
    author: username || undefined,
    cookTime: recipe?.cookTime || '',
    prepTime: recipe?.prepTime || '',
    ingredientGroups: (recipe?.ingredientGroups.map((group) => ({
      groupTitle: group.groupTitle || '',
      description: group.description || '',
      ingredients: group.ingredients.map((ingredient) => ({
        qty: ingredient.qty || undefined,
        uom: ingredient.uom || undefined,
        description: ingredient.description,
      })),
    })) as Extract<FormInput, 'ingredientGroups'>) || [
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
    procedureGroups: (recipe?.procedureGroups.map((group) => ({
      groupTitle: group.groupTitle || '',
      description: group.description || '',
      procedureSteps: group.procedureSteps.map((step) => ({
        description: step.description || '',
        timer: step.timer || undefined,
      })),
    })) as Extract<FormInput, 'procedureGroups'>) || [
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

  const methods = useForm<FormInput>({
    defaultValues: defaultFormValues,
    resolver: zodResolver(newRecipeFormInputSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  useEffect(() => {
    if (recipe?.id) {
      reset(
        {
          ...defaultFormValues,
          author: recipe.author.username,
        },
        { keepDirtyValues: true }
      );
      setSelectedTags(new Map(recipe.tags.map((tag) => [tag.id, tag])));
    }
  }, [recipe?.id]);

  // package up the form submission to make it easier to pass to left pane
  const submitForm = handleSubmit(onSubmit);

  function resetForm() {
    setSelectedTags(
      recipe?.id ? new Map(recipe?.tags.map((tag) => [tag.id, tag])) : undefined
    );
    reset(defaultFormValues);
  }

  function toggleTag(tag: Tag) {
    let tempTags = new Map(selectedTags);

    if (tempTags.has(tag.id)) tempTags.delete(tag.id);
    else tempTags.set(tag.id, tag);

    setSelectedTags(tempTags);
  }

  function onSubmit(data: FormInput) {
    data.author = username!;

    if (selectedTags?.size ?? -1 > 0) {
      data.tags = Array.from(selectedTags!.values()) as typeof data.tags;
    }

    if (recipeId && recipe?.id) {
      editMutation.mutate({ ...data, recipeId });
    } else {
      createMutation.mutate(data);
    }
  }

  return (
    <div className='flex flex-col w-full h-full pb-6 overflow-x-hidden'>
      <header className='flex justify-between items-center h-fit shrink-0 gap-6 w-full'>
        <h1 className='display-medium whitespace-nowrap text-ellipsis overflow-x-hidden basis-auto'>
          {watch('title') || (recipeId && 'Edit Recipe') || 'New Recipe'}
        </h1>
        <Button icon={<SaveIcon />} onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
      </header>
      <main className='flex justify-stretch items-start w-full gap-6 h-full overflow-hidden'>
        <FormLeftPane {...{ resetForm, submitForm, toggleTag, selectedTags }} />
        <article className='w-full shrink flex flex-col gap-6 bg-surface-container shadow-sm rounded-[12px] p-6 h-fit max-h-full overflow-y-auto'>
          <FormProvider {...methods}>
            <form className='w-full flex flex-col justify-start gap-6 h-fit'>
              <h2 className='title-large'>Basic Info</h2>
              <FormInput
                {...{
                  fieldName: 'title',
                  fieldLabel: 'Recipe title*',
                }}
              />

              <div className='flex gap-6'>
                <FormInput
                  {...{
                    fieldName: 'prepTime',
                    fieldLabel: 'Prep time',
                    supportingText: 'HH:MM',
                    inputWidth: 'small',
                  }}
                />

                <FormInput
                  {...{
                    fieldName: 'cookTime',
                    fieldLabel: 'Cook time',
                    supportingText: 'HH:MM',
                    inputWidth: 'small',
                  }}
                />
              </div>

              <IngredientsSection />

              <ProcedureSection />
              <Button icon={<SaveIcon />} onClick={submitForm}>
                Save
              </Button>
            </form>
          </FormProvider>
        </article>
      </main>
    </div>
  );
}
