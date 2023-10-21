import { type BaseSyntheticEvent } from 'react';
import TagsContainer from './TagsContainer';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';
import Button from '../../../components/Button';
import SaveIcon from '../../../assets/icons/SaveIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';

type FormLeftPaneProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
  submitForm: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  resetForm: () => void;
};

// TODO: add references

export default function FormLeftPane({
  toggleTag,
  selectedTags,
  submitForm,
  resetForm,
}: FormLeftPaneProps) {
  return (
    <section className='w-[360px] shrink-0 p-6 flex flex-col gap-6 justify-start items-center bg-surface-container rounded-[12px] shadow-sm h-fit max-h-full overflow-y-auto'>
      <TagsContainer {...{ toggleTag, selectedTags }} />
      <div className='flex gap-4 w-full justify-center'>
        <Button
          icon={<SaveIcon />}
          onClick={submitForm}
          style={{ alignSelf: 'start' }}
        >
          Save
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
