import { useNavigate } from 'react-router-dom';

import CreateRecipeIcon from '../../assets/icons/CreateRecipeIcon';
import RecipePotIcon from '../../assets/icons/RecipePotIcon';
import NavRailButton from './NavRailButton';

export default function NavRail() {
  const navigate = useNavigate();

  return (
    <nav className='w-20 mt-20 left-0 top-20 flex flex-col items-center gap-3 on-background-text shrink-0'>
      <NavRailButton
        icon={<RecipePotIcon />}
        label='Recipes'
        onClick={() => navigate('/recipes')}
      />
      <NavRailButton
        icon={<CreateRecipeIcon />}
        label='New'
        onClick={() => navigate('/recipes/create-new-recipe')}
      />
      <NavRailButton
        icon={<RecipePotIcon />}
        label='Recipes'
        onClick={() => console.log('recipes clicked')}
      />
    </nav>
  );
}
