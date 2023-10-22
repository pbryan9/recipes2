import { useEffect, useState } from 'react';

import { type Tag } from '../../../../../api-server/db/tags/getAllTags';
import TagChip from './TagChip';
import MinusIcon from '../../../assets/icons/MinusIcon';
import PlusIcon from '../../../assets/icons/PlusIcon';
import useTags from '../../../lib/hooks/useTags';
import CreateTagChip from './CreateTagChip';

type CreateTagsContainerProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
};

export default function TagsContainer({
  toggleTag,
  selectedTags,
}: CreateTagsContainerProps) {
  const [expanded, setExpanded] = useState(true);

  const { tags } = useTags();

  useEffect(() => {
    // upon new tag creation, a 'tagCreated' custom event will emit
    // use this to append new tag to map of selected tags
    function addTagToSelected({ detail: tag }: CustomEvent<Tag>) {
      toggleTag(tag);
    }

    addEventListener('tagCreated', addTagToSelected);

    return () => removeEventListener('tagCreated', addTagToSelected);
  }, []);

  return (
    <article className='flex flex-col items-center w-full h-fit'>
      <button
        className='z-10 w-full'
        onClick={() => setExpanded((prev) => !prev)}
      >
        <header className='title-large h-14 w-full px-4 flex items-center gap-4 bg-surface-container-high rounded-full shadow-md'>
          {expanded ? <MinusIcon /> : <PlusIcon />}
          Tags
        </header>
      </button>
      <section
        className={`w-full relative z-0 shadow-sm rounded-[12px] transition-all duration-500 overflow-clip bg-surface-container-low grid ${
          expanded
            ? 'grid-rows-[1fr] -top-7 opacity-1'
            : 'grid-rows-[0fr] -top-14 bg-transparent opacity-0'
        }`}
      >
        <div
          className={`flex flex-wrap items-start justify-start w-full h-full gap-2 px-6 overflow-clip transition-all duration-200 ${
            expanded ? 'pt-14 pb-6' : 'py-0'
          }`}
        >
          {tags.map((tag) => (
            <TagChip
              key={tag.id}
              {...{ tag, toggleTag, selected: selectedTags?.has(tag.id) }}
            />
          ))}
          <CreateTagChip />
        </div>
      </section>
    </article>
  );
}
