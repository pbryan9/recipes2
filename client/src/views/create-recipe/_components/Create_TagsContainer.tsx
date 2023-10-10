import { useEffect, useState } from 'react';

import { type Tag } from '../../../../../api-server/db/tags/getAllTags';
import LeftNavCardContainer from '../../../components/LeftNavCardContainer';
import LeftNavCard from '../../../components/LeftNavCard';
import { trpc } from '../../../utils/trpc';

type CreateTagsContainerProps = {
  toggleTag: (tag: Tag) => void;
  selectedTags?: Map<string, Tag>;
};

export default function CreateTagsContainer({
  toggleTag,
  selectedTags,
}: CreateTagsContainerProps) {
  const utils = trpc.useContext();

  const [tags, setTags] = useState<[string, Tag[]][] | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    const res = await utils.getAllTags.fetch();
    setTags(arrangeTagsByGroup(res));
  }

  function arrangeTagsByGroup(tags: Tag[]) {
    const groupedTagsMap = new Map<string, typeof tags>();

    tags.forEach((tag) => {
      let groupName = tag.tagGroup || 'Uncategorized';

      if (groupedTagsMap.has(groupName)) {
        groupedTagsMap.get(groupName)?.push(tag);
      } else groupedTagsMap.set(groupName, [tag]);
    });

    const groupedTags = Array.from(groupedTagsMap.entries());

    return groupedTags;
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
    </LeftNavCardContainer>
  );
}
