import MinusIcon from '../../assets/icons/MinusIcon';
import PlusIcon from '../../assets/icons/PlusIcon';

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
    <header className='w-full h-14 rounded-full bg-surface-container-high drop-shadow-level2 relative z-10'>
      <button
        className='w-full h-full rounded-full px-6 flex justify-between items-center'
        onClick={toggle}
      >
        <h2 className='title-large text-on-surface'>{heading}</h2>
        <div className='print:hidden'>
          {isExpanded ? <MinusIcon /> : <PlusIcon />}
        </div>
      </button>
    </header>
  );
}
