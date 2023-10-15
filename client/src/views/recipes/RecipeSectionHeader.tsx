import CollapseIcon from '../../assets/icons/CollapseIcon';
import ExpandIcon from '../../assets/icons/ExpandIcon';

type RecipeSectionHeaderProps = {
  heading: string;
  toggle: () => void;
  isExpanded: boolean;
};

export default function RecipeSectionHeader({
  heading = 'Ingredients',
  toggle,
  isExpanded,
}: RecipeSectionHeaderProps) {
  return (
    <header className='w-full rounded-full bg-surface-container-high px-6 h-14 flex justify-between items-center drop-shadow-level2 relative z-10'>
      <h2 className='title-large text-on-surface'>{heading}</h2>
      <button onClick={toggle}>
        {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
      </button>
    </header>
  );
}
