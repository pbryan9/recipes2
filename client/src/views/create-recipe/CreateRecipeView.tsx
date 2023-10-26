import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  NoteInput,
  newRecipeFormInputSchema,
} from '../../../../api-server/validators/newRecipeFormValidator';

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
import LoadingIcon from '../../assets/icons/LoadingIcon';

type FormInput = RouterInputs['recipes']['create'];

export type NewNote = NoteInput & { tempId: string };

export default function CreateRecipeView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const utils = trpc.useContext();
  const [selectedTags, setSelectedTags] = useState<Map<string, Tag>>();
  const [recipeMutationIsLoading, setRecipeMutationIsLoading] = useState(false);
  const [notes, setNotes] = useState<NewNote[]>([]);
  const {
    isLoggedIn: userIsLoggedIn,
    isLoading: userIsLoading,
    username,
  } = useUser();
  const { recipes } = useRecipes();

  const recipeId = searchParams.get('recipeId');
  const recipe = recipeId ? recipes.find(({ id }) => id === recipeId) : null;

  useEffect(() => {
    if (!userIsLoading && !userIsLoggedIn) navigate('/recipes');
  }, [userIsLoading, userIsLoggedIn]);

  useEffect(() => {
    document.title = recipeId ? 'Editing Recipe' : 'New Recipe Form';
  }, [recipeId]);

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
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
    },
  });

  const editMutation = trpc.recipes.edit.useMutation({
    onSuccess() {
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId: recipeId! });
      navigate(`/recipes?recipeId=${recipeId}`);
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
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

  const { handleSubmit, reset, watch, setFocus } = methods;

  useEffect(() => {
    setFocus('title');
  }, []);

  useEffect(() => {
    // clear form when switching from 'edit' to 'new'
    if (!recipeId) {
      resetForm();
    }
  }, [recipeId]);

  useEffect(() => {
    // update form with existing values if we're editing rather than creating
    if (recipe?.id) {
      reset(
        {
          ...defaultFormValues,
          author: recipe.author.username,
        },
        { keepDirtyValues: true }
      );
      setSelectedTags(new Map(recipe.tags.map((tag) => [tag.id, tag])));
      setNotes(recipe.notes.map((note) => ({ ...note, tempId: note.id })));
    }
  }, [recipe?.id]);

  // package up the form submission to make it easier to pass to left pane
  const submitForm = handleSubmit(onSubmit);

  function resetForm() {
    setSelectedTags(
      recipe?.id ? new Map(recipe?.tags.map((tag) => [tag.id, tag])) : undefined
    );
    setNotes(recipe?.notes.map((note) => ({ ...note, tempId: note.id })) ?? []);
    reset(defaultFormValues);
  }

  function toggleTag(tag: Tag) {
    setSelectedTags((prev) => {
      let tempTags = new Map(prev);

      if (tempTags.has(tag.id)) tempTags.delete(tag.id);
      else tempTags.set(tag.id, tag);

      return tempTags;
    });
  }

  function onSubmit(data: FormInput) {
    // append info not directly collected by the form
    data.author = username!;

    if (selectedTags?.size ?? -1 > 0) {
      data.tags = Array.from(selectedTags!.values()) as typeof data.tags;
    }

    if (notes.length > 0) {
      data.notes = notes;
    }

    // determine whether we're in edit mode (i.e., recipeId exists) and send correct mutation
    if (recipeId && recipe?.id) {
      editMutation.mutate({ ...data, recipeId });
    } else {
      createMutation.mutate(data);
    }
  }

  function startLoading() {
    setRecipeMutationIsLoading(true);
  }

  function finishLoading() {
    setRecipeMutationIsLoading(false);
  }

  return (
    <div className='flex flex-col w-full h-full pb-6 overflow-x-hidden'>
      <header className='flex justify-between items-center h-fit shrink-0 gap-6 w-full'>
        <h1 className='display-medium whitespace-nowrap text-ellipsis overflow-x-hidden basis-auto'>
          {watch('title') || (recipeId && 'Edit Recipe') || 'New Recipe'}
        </h1>
        <Button
          icon={recipeMutationIsLoading ? <LoadingIcon /> : <SaveIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          {recipeMutationIsLoading ? 'Saving...' : 'Save'}
        </Button>
      </header>
      <main className='flex justify-stretch items-start w-full gap-6 h-full overflow-hidden'>
        <FormLeftPane
          {...{
            resetForm,
            submitForm,
            toggleTag,
            selectedTags,
            notes,
            setNotes,
            recipeMutationIsLoading,
          }}
        />
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
              <Button
                icon={recipeMutationIsLoading ? <LoadingIcon /> : <SaveIcon />}
                onClick={submitForm}
              >
                {recipeMutationIsLoading ? 'Saving...' : 'Save'}
              </Button>
            </form>
          </FormProvider>
        </article>
      </main>
    </div>
  );
}
