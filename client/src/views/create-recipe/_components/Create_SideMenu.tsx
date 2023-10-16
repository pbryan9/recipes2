import { type BaseSyntheticEvent } from 'react';
import LeftNav from '../../../components/LeftNav';
import CreateTagsContainer from './Create_TagsContainer';
import LeftNavCard from '../../../components/LeftNavCard';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';

type CreateSideMenuProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
  submitForm: (
    e?: BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  resetForm: () => void;
};

// TODO: add references

export default function CreateSideMenu({
  toggleTag,
  selectedTags,
  submitForm,
  resetForm,
}: CreateSideMenuProps) {
  return (
    <section className='w-[360px] p-6 flex flex-col gap-6 justify-start items-center bg-surface-container rounded-[12px] shadow-sm'>
      <CreateTagsContainer {...{ toggleTag, selectedTags }} />
    </section>
  );
}
