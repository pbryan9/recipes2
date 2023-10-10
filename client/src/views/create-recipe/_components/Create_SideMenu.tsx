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

export default function CreateSideMenu({
  toggleTag,
  selectedTags,
  submitForm,
  resetForm,
}: CreateSideMenuProps) {
  return (
    <LeftNav>
      <CreateTagsContainer {...{ toggleTag, selectedTags }} />
      <LeftNavCard onClick={submitForm}>Save Recipe</LeftNavCard>
      <LeftNavCard onClick={resetForm}>Clear Form</LeftNavCard>
    </LeftNav>
  );
}
