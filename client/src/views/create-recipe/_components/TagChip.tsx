import React from 'react';
import { Tag } from '../../../../../api-server/db/tags/getAllTags';
import CheckIcon from '../../../assets/icons/CheckIcon';

type TagChipProps = {
  selected?: boolean;
  tag: Tag;
  toggleTag: (tag: Tag) => void;
};

export default function TagChip({
  selected = false,
  tag,
  toggleTag,
}: TagChipProps) {
  return (
    <button
      className={`label-large shrink-0 rounded-[5px] h-8 flex flex-nowrap items-center gap-2 ${
        selected
          ? 'pl-2 pr-4 bg-secondary-container'
          : 'border border-outline px-4'
      }`}
      onClick={() => toggleTag(tag)}
      key={tag.id}
    >
      {selected && <CheckIcon size={18} />}
      {tag.description}
    </button>
  );
}
