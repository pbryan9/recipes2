import { useEffect, useState } from 'react';

import { type Tag } from '../../../../../api-server/db/tags/getAllTags';
import { trpc } from '../../../lib/trpc/trpc';
// import CreateNewTag from './CreateNewTag';
import TagChip from './TagChip';
import CollapseIcon from '../../../assets/icons/CollapseIcon';
import ExpandIcon from '../../../assets/icons/ExpandIcon';

type CreateTagsContainerProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
};

// TODO: create new tag

export default function CreateTagsContainer({
  toggleTag,
  selectedTags,
}: CreateTagsContainerProps) {
  const [expanded, setExpanded] = useState(true);

  const tagQuery = trpc.tags.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  function arrangeTagsByGroup(tags: Tag[]) {
    const groupedTagsMap = new Map<string, typeof tags>();

    groupedTagsMap.set('all', []);

    tags.forEach((tag) => {
      let groupName = tag.tagGroup || 'Uncategorized';

      if (groupedTagsMap.has(groupName)) {
        groupedTagsMap.get(groupName)?.push(tag);
      } else groupedTagsMap.set(groupName, [tag]);

      groupedTagsMap.get('all')?.push(tag);
    });

    // sort each group alphabetically
    const groups = Array.from(groupedTagsMap.entries());
    for (let [_, tags] of groups) {
      tags.sort((a, b) =>
        a.description.toLowerCase() > b.description.toLowerCase() ? 1 : -1
      );
    }

    return groups;
  }

  return (
    <article className='flex flex-col items-center w-full h-full'>
      <header className='title-large h-14 w-full px-4 flex items-center gap-4 bg-surface-container-high rounded-full shadow-md'>
        <button onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? <CollapseIcon /> : <ExpandIcon />}
        </button>
        Tags
      </header>
      <section
        className={`w-full flex flex-wrap items-start justify-start gap-2 p-6 shadow-sm rounded-[12px] bg-surface-container-low ${
          expanded ? '' : 'hidden'
        }`}
      >
        {tagQuery.data?.map((tag) => (
          <TagChip
            key={tag.id}
            {...{ tag, toggleTag, selected: selectedTags?.has(tag.id) }}
          />
        ))}
      </section>
    </article>
  );
}
