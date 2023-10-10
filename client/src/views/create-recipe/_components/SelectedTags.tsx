import type { Tag } from '../../../../../api-server/db/tags/getAllTags';
import TagBadge from '../../../components/TagBadge';

type SelectedTagsProps = {
  selectedTags: Map<string, Tag>;
  removeSelectedTag: (tag: Tag) => void;
};

export default function SelectedTags({
  selectedTags,
  removeSelectedTag,
}: SelectedTagsProps) {
  const tags: Tag[] = [];

  selectedTags.forEach((tag) => {
    tags.push(tag);
  });

  const tagBadges = tags.map((tag) => (
    <TagBadge key={tag.id} onClick={() => removeSelectedTag(tag)}>
      {tag.description}
    </TagBadge>
  ));

  return (
    <section className='col-span-full grid grid-cols-8 gap-4'>
      <h2 className='text-2xl col-span-2'>Tags:</h2>
      <div className='col-span-6 flex justify-start items-center gap-4 h-full'>
        {tagBadges}
      </div>
    </section>
  );
}
