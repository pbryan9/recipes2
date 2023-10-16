import CreateRecipeIcon from '../../assets/icons/CreateRecipeIcon';
import RecipePotIcon from '../../assets/icons/RecipePotIcon';
import NavRailButton from './NavRailButton';

export default function NavRail() {
  return (
    <nav className='w-20 mt-20 left-0 top-20 flex flex-col items-center gap-3 on-background-text shrink-0'>
      <NavRailButton
        icon={<RecipePotIcon />}
        label='Recipes'
        onClick={() => console.log('recipes clicked')}
      />
      <NavRailButton
        icon={<CreateRecipeIcon />}
        label='New'
        onClick={() => console.log('new recipes clicked')}
      />
      <NavRailButton
        icon={<RecipePotIcon />}
        label='Recipes'
        onClick={() => console.log('recipes clicked')}
      />
    </nav>
  );
}
