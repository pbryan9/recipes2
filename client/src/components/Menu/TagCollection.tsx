import { useState } from 'react';
import { Tag } from '../../../../api-server/db/tags/getAllTags';
import useTags from '../../lib/hooks/useTags';
import TagChip from '../../views/create-recipe/_components/TagChip';
import Button from '../Button';
import MenuSeparator from './MenuSeparator';

export default function TagCollection() {
  // use tag id as selectedTags map key
  const [selectedTags, setSelectedTags] = useState<Map<string, Tag>>(new Map());
  const { tags } = useTags();

  function toggleTag(tag: Tag) {
    const selectedTagCopy = new Map(selectedTags);

    if (selectedTagCopy.has(tag.id)) {
      selectedTagCopy.delete(tag.id);
    } else {
      selectedTagCopy.set(tag.id, tag);
    }

    setSelectedTags(selectedTagCopy);
  }

  function selectAll() {
    const allTagsMap = new Map<string, Tag>();
    tags.forEach((tag) => {
      allTagsMap.set(tag.id, tag);
    });
    setSelectedTags(allTagsMap);
  }

  function selectNone() {
    setSelectedTags(new Map<string, Tag>());
  }

  // group tags depending on whether or not they're selected
  const deselectedTags = tags.filter((tag) => !selectedTags.has(tag.id));
  // const renderTags = [...selectedTags.values(), ...deselectedTags];

  return (
    <div
      className={`flex flex-wrap items-start justify-start w-[360px] max-w-full h-full gap-2 p-6 overflow-clip transition-all duration-200`}
      onClick={(e) => e.stopPropagation()}
    >
      {selectedTags.size > 0 &&
        Array.from(selectedTags.values()).map((tag) => (
          <TagChip
            key={tag.id}
            {...{ tag, toggleTag, selected: selectedTags?.has(tag.id) }}
          />
        ))}
      {selectedTags.size > 0 && deselectedTags.length > 0 && <MenuSeparator />}
      {deselectedTags.length > 0 &&
        deselectedTags.map((tag) => (
          <TagChip
            key={tag.id}
            {...{ tag, toggleTag, selected: selectedTags?.has(tag.id) }}
          />
        ))}
      <MenuSeparator />
      <Button variant='text' onClick={selectAll}>
        Select all
      </Button>
      <Button variant='text' onClick={selectNone}>
        Select none
      </Button>
    </div>
  );
}
