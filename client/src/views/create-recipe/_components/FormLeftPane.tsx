import React, { type BaseSyntheticEvent } from 'react';
import TagsContainer from './TagsContainer';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';
import Button from '../../../components/Button';
import SaveIcon from '../../../assets/icons/SaveIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';
import NotesContainer from './NotesContainer';
import { NewNote } from '../CreateRecipeView';
import LoadingIcon from '../../../assets/icons/LoadingIcon';

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
          icon={<TrashIcon color='#FFB4AB' />}
          variant='danger'
          onClick={() => resetForm()}
        >
          Reset Form
        </Button>
      </div>
    </section>
  );
}
