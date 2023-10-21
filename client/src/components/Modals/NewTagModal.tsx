import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import Modal from './Modal';
import newTagFormValidator, {
  type NewTagInput,
} from '../../../../api-server/validators/newTagFormValidator';
import useTags from '../../lib/hooks/useTags';
import NewIcon from '../../assets/icons/NewIcon';
import { useEffect, useRef } from 'react';

type NewTagModalProps = {
  dismissModal: () => void;
};

export default function NewTagModal({ dismissModal }: NewTagModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const { tags, createTag } = useTags();

  const methods = useForm<NewTagInput>({
    resolver: zodResolver(newTagFormValidator),
  });

  const { handleSubmit, setFocus } = methods;

  function onSubmit(formInput: NewTagInput) {
    if (tags.find((tag) => tag.description === formInput.tagName))
      throw new Error(`Tag ${formInput.tagName} already exists.`);

    createTag(formInput);

    dismissModal();
  }

  useEffect(() => {
    setFocus('tagName');
  }, []);

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Tag name*' fieldName='tagName' />
        <FormInput
          fieldLabel='Tag group'
          supportingText='Optional'
          fieldName='tagGroup'
        />
        <button type='submit' className='invisible'></button>
      </form>
    </FormProvider>
  );

  const modalButtons = (
    <>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button icon={<NewIcon />} onClick={handleSubmit(onSubmit)}>
        Create tag
      </Button>
    </>
  );

  return (
    <Modal
      headline='Create new tag'
      caption='Add a new tag to help organize your recipe collection'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
