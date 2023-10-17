import { type BaseSyntheticEvent } from 'react';
import CreateTagsContainer from './Create_TagsContainer';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';
import Button from './Button';
import SaveIcon from '../../../assets/icons/SaveIcon';

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
  submitForm, // resetForm,
}: FormLeftPaneProps) {
  return (
    <section className='w-[360px] shrink-0 p-6 flex flex-col gap-6 justify-start items-center bg-surface-container rounded-[12px] shadow-sm h-fit max-h-full overflow-y-auto'>
      <CreateTagsContainer {...{ toggleTag, selectedTags }} />
      <Button
        icon={<SaveIcon />}
        onClick={submitForm}
        style={{ alignSelf: 'start' }}
      >
        Save
      </Button>
    </section>
  );
}
