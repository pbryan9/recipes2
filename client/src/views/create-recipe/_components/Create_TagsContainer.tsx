import { useEffect, useState } from 'react';

import { type Tag } from '../../../../../api-server/db/tags/getAllTags';
import LeftNavCardContainer from '../../../components/LeftNavCardContainer';
import LeftNavCard from '../../../components/LeftNavCard';
import { trpc } from '../../../lib/trpc/trpc';
import CreateNewTag from './CreateNewTag';

type CreateTagsContainerProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
};

export default function CreateTagsContainer({
  toggleTag,
  selectedTags,
}: CreateTagsContainerProps) {
  const [tags, setTags] = useState<[string, Tag[]][] | null>(null);

  const tagQuery = trpc.tags.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!tagQuery.isFetching) {
      setTags(arrangeTagsByGroup(tagQuery.data!));
    }
  }, [tagQuery.isFetching]);

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
    <LeftNavCardContainer title='Add Tags'>
      {tags?.length &&
        tags.map(([groupTitle, tags]) => {
          return (
            <LeftNavCardContainer
              key={groupTitle}
              variant='sub-container'
              title={`${groupTitle.toLowerCase()} tags`}
            >
              {tags.map((tag) => (
                <LeftNavCard
                  onClick={() => toggleTag(tag)}
                  key={tag.id}
                  variant='sub-sub-item'
                  selected={selectedTags?.has(tag.id)}
                >
                  {tag.description.toLowerCase()}
                </LeftNavCard>
              ))}
            </LeftNavCardContainer>
          );
        })}
      <CreateNewTag toggleTag={toggleTag} />
    </LeftNavCardContainer>
  );
}
