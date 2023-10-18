import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import Button from './_components/Button';
import SaveIcon from '../../assets/icons/SaveIcon';

type FormInput = RouterInputs['recipes']['create'];

const defaultValues: FormInput = {
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

export default function CreateRecipeView() {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const { isLoggedIn, isLoading, username } = useUser();

  useEffect(() => {
    // cannot create recipes if not logged in

    // TODO: come back & test this for not-logged-in state
    if (!isLoggedIn && !isLoading) navigate('/sign-in');
  }, [isLoggedIn]);

  const mutation = trpc.recipes.create.useMutation({
    onSuccess: (data) => {
      utils.recipes.all.invalidate();
      console.log(data);
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

  const methods = useForm<FormInput>({
    defaultValues,
    resolver: zodResolver(newRecipeFormInputSchema),
  });

  const { handleSubmit, reset, watch } = methods;

  // package up the form submission to make it easier to pass to left pane
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

  async function onSubmit(data: FormInput) {
    data.author = username!;

    if (selectedTags?.size && selectedTags.size > 0) {
      data.tags = Array.from(selectedTags.values()) as typeof data.tags;
    }

    mutation.mutate(data);
  }

  return (
    <div className='flex flex-col w-full h-full pb-6'>
      <header className='w-full flex justify-between items-center h-fit shrink-0'>
        <h1 className='display-medium'>{watch('title') || 'New Recipe'}</h1>
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
              <Button icon={<SaveIcon />} onClick={handleSubmit(onSubmit)}>
                Save
              </Button>
            </form>
          </FormProvider>
        </article>
      </main>
    </div>
  );
}
