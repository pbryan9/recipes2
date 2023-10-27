import React, { useEffect, type BaseSyntheticEvent } from 'react';
import TagsContainer from './TagsContainer';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';
import Button from '../../../components/Button';
import SaveIcon from '../../../assets/icons/SaveIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';
import NotesContainer from './NotesContainer';
import { NewNote } from '../CreateRecipeView';
import LoadingIcon from '../../../assets/icons/LoadingIcon';
import { useModal } from '../../../lib/context/ModalContextProvider';
import RestartIcon from '../../../assets/icons/RestartIcon';

type FormLeftPaneProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
  notes: NewNote[];
  setNotes: React.Dispatch<React.SetStateAction<NewNote[]>>;
  submitForm: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  resetForm: () => void;
  recipeMutationIsLoading: boolean;
};

// TODO: add references

export default function FormLeftPane({
  toggleTag,
  selectedTags,
  notes,
  setNotes,
  submitForm,
  resetForm,
  recipeMutationIsLoading,
}: FormLeftPaneProps) {
  const { openModal } = useModal();

  function resetConfirmed() {
    resetForm();
    clearListeners();
  }

  function clearListeners() {
    window.removeEventListener('reset_confirmed', resetConfirmed);
    window.removeEventListener('reset_cancelled', clearListeners);
  }

  function reset() {
    window.addEventListener('reset_confirmed', resetConfirmed);
    window.addEventListener('reset_cancelled', clearListeners);

    openModal('confirmToResetForm');
  }

  useEffect(() => {
    return clearListeners;
  }, []);

  return (
    <section className='w-[360px] shrink-0 p-6 flex flex-col gap-6 justify-start items-center bg-surface-container rounded-[12px] shadow-sm h-fit max-h-full overflow-y-auto'>
      <TagsContainer {...{ toggleTag, selectedTags, notes, setNotes }} />
      <NotesContainer {...{ notes, setNotes }} />
      <div className='flex gap-4 w-full justify-center'>
        <Button
          icon={recipeMutationIsLoading ? <LoadingIcon /> : <SaveIcon />}
          onClick={submitForm}
          style={{ alignSelf: 'start' }}
        >
          {recipeMutationIsLoading ? 'Saving...' : 'Save'}
        </Button>
        <Button
          icon={<RestartIcon color='#FFB4AB' />}
          variant='danger'
          // onClick={() => resetForm()}
          onClick={reset}
        >
          Reset Form
        </Button>
      </div>
    </section>
  );
}
