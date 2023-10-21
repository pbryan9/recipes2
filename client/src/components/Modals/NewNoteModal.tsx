import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import Modal from './Modal';
import NewIcon from '../../assets/icons/NewIcon';
import { useEffect, useRef } from 'react';
import {
  NoteInput,
  noteInputSchema,
} from '../../../../api-server/validators/newRecipeFormValidator';
import { NewNote } from '../../views/create-recipe/CreateRecipeView';

type NewNoteModalProps = {
  dismissModal: () => void;
};

export default function NewNoteModal({ dismissModal }: NewNoteModalProps) {
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const methods = useForm<NoteInput>({
    resolver: zodResolver(noteInputSchema),
  });

  const { handleSubmit, setFocus } = methods;

  function onSubmit(formInput: NoteInput) {
    const noteAdded = new CustomEvent<NewNote>('noteAdded', {
      detail: {
        description: formInput.description,
        tempId: crypto.randomUUID(),
      },
    });

    window.dispatchEvent(noteAdded);

    dismissModal();
  }

  useEffect(() => {
    setFocus('description');
  }, []);

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Note*' fieldName='description' />
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
        Create note
      </Button>
    </>
  );

  return (
    <Modal
      headline='Add a note'
      caption="Add a description, some tips you'll want to remember next time, or a bit of history about this recipe"
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
