import useTags from '../../lib/hooks/useTags';
import TagChip from '../../views/create-recipe/_components/TagChip';
import Button from '../Button';
import MenuSeparator from './MenuSeparator';
import useFilter from '../../lib/hooks/useFilter';
import Toggler from '../Toggler';

export default function TagCollection() {
  // use tag id as selectedTags map key
  const { tags } = useTags();
  const {
    tagFilterSelection,
    toggleFilterTag,
    selectAllFilterTags,
    clearFilterTags,
    matchEveryTag,
    toggleMatchEveryTag,
  } = useFilter();

  // group tags depending on whether or not they're selected
  const deselectedTags = tags.filter((tag) => !tagFilterSelection.has(tag.id));

  return (
    <div
      className={`flex flex-wrap items-start justify-start w-[360px] max-w-full h-full gap-2 p-6 overflow-clip transition-all duration-200 cursor-default`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={`flex justify-between items-center w-full`}
        onClick={toggleMatchEveryTag}
      >
        Match mode:
        <div className={`flex gap-4 justify-end items-center`}>
          Any
          <Toggler as='div' isOn={matchEveryTag} />
          Every
        </div>
      </button>
      <MenuSeparator />
      {tagFilterSelection.size > 0 &&
        Array.from(tagFilterSelection.values()).map((tag) => (
          <TagChip
            key={tag.id}
            {...{
              tag,
              toggleTag: toggleFilterTag,
              selected: tagFilterSelection?.has(tag.id),
            }}
          />
        ))}

      {tagFilterSelection.size > 0 && deselectedTags.length > 0 && (
        <MenuSeparator />
      )}

      {deselectedTags.length > 0 &&
        deselectedTags.map((tag) => (
          <TagChip
            key={tag.id}
            {...{
              tag,
              toggleTag: toggleFilterTag,
              selected: tagFilterSelection?.has(tag.id),
            }}
          />
        ))}
      <MenuSeparator />
      <Button variant='text' onClick={selectAllFilterTags}>
        Select all
      </Button>
      <Button
        variant='text'
        disabled={tagFilterSelection.size === 0}
        onClick={clearFilterTags}
      >
        Clear tag filter
      </Button>
    </div>
  );
}
