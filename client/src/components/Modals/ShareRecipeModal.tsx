import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import shareRecipeValidator, {
  type ShareRecipeInput,
} from '../../../../api-server/validators/shareRecipeValidator';

import { useModal } from '../../lib/context/ModalContextProvider';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import Modal from './Modal';
import { trpc } from '../../lib/trpc/trpc';
import { useSearchParams } from 'react-router-dom';

type ShareRecipeModalProps = {};

export default function ShareRecipeModal({}: ShareRecipeModalProps) {
  const { dismissModal } = useModal();
  const [searchParams] = useSearchParams();

  const recipeId = searchParams.get('recipeId');

  const methods = useForm<ShareRecipeInput>({
    resolver: zodResolver(shareRecipeValidator),
    defaultValues: {
      recipeId: recipeId || '',
      toEmail: '',
    },
  });

  const { handleSubmit } = methods;

  const shareRecipeMutation = trpc.recipes.share.useMutation({});

  const { isLoading, isSuccess, mutate: shareRecipe } = shareRecipeMutation;

  function onSubmit(input: ShareRecipeInput) {
    shareRecipe(input);
  }

  if (!recipeId) alert('No recipe id');

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          fieldLabel='To email*'
          fieldName='toEmail'
          supportingText='e.g., pattyb@pattyb.dev'
        />

        <button
          type='submit'
          className='invisible'
          disabled={isLoading}
        ></button>
      </form>
    </FormProvider>
  );

  const modalButtons = (
    <>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Share recipe'}
      </Button>
    </>
  );

  if (isSuccess)
    return (
      <Modal
        headline='Share successful'
        caption={`All done! We sent a copy of this recipe to ${methods.getValues(
          'toEmail'
        )}`}
        body={''}
        buttons={<Button onClick={dismissModal}>Close</Button>}
      />
    );

  return (
    <Modal
      headline='Share recipe'
      caption='Enter an email address below to share a copy of this recipe'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
