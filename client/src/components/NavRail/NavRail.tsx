import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import CreateRecipeIcon from '../../assets/icons/CreateRecipeIcon';
import RecipePotIcon from '../../assets/icons/RecipePotIcon';
import NavRailButton from './NavRailButton';
import useUser from '../../lib/hooks/useUser';
import LogoutIcon from '../../assets/icons/LogoutIcon';
import LoginIcon from '../../assets/icons/LoginIcon';
import EditIcon from '../../assets/icons/EditIcon';
import useRecipes from '../../lib/hooks/useRecipes';
import TrashIcon from '../../assets/icons/TrashIcon';
import SignInModal from '../SignInModal';
import SignUpIcon from '../../assets/icons/SignUpIcon';
import SignUpModal from '../SignUpModal';

export default function NavRail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn, logout, username } = useUser();
  const { recipes, deleteRecipe } = useRecipes();
  const [showModal, setShowModal] = useState<false | 'signIn' | 'signUp'>(
    false
  );

  const { pathname } = useLocation();

  const selectedRecipe = searchParams.get('recipeId');

  // returns true if the currently-selected recipe was authored by the signed-in user
  const ownedRecipe =
    isLoggedIn &&
    (selectedRecipe
      ? recipes.some(
          ({ author: { username: recipeAuthor }, id }) =>
            username === recipeAuthor && selectedRecipe === id
        )
      : false);

  return (
    <nav className='w-20 mt-20 left-0 top-20 flex flex-col items-center gap-3 on-background-text shrink-0 print:hidden'>
      {showModal === 'signIn' && <SignInModal setShowModal={setShowModal} />}
      {showModal === 'signUp' && <SignUpModal setShowModal={setShowModal} />}
      <NavRailButton
        icon={<RecipePotIcon />}
        label='Recipes'
        onClick={() => navigate('/recipes')}
        disabled={!!selectedRecipe && pathname !== '/recipes/edit'}
      />
      {isLoggedIn && (
        <NavRailButton
          icon={<CreateRecipeIcon />}
          label='New'
          disabled={pathname === '/recipes/create-new-recipe'}
          onClick={() => navigate('/recipes/create-new-recipe')}
        />
      )}
      {ownedRecipe && (
        <>
          <NavRailButton
            icon={<EditIcon />}
            label='Edit'
            disabled={pathname === '/recipes/edit'}
            onClick={() => navigate(`/recipes/edit?recipeId=${selectedRecipe}`)}
          />
          <NavRailButton
            icon={<TrashIcon />}
            label='Delete'
            onClick={() => deleteRecipe(selectedRecipe!)}
          />
        </>
      )}
      {isLoggedIn && (
        <NavRailButton
          icon={<LogoutIcon />}
          label='Sign out'
          onClick={() => logout()}
        />
      )}
      {!isLoggedIn && (
        <>
          <NavRailButton
            icon={<SignUpIcon />}
            label='Sign up'
            onClick={() => setShowModal('signUp')}
          />
          <NavRailButton
            icon={<LoginIcon />}
            label='Sign in'
            onClick={() => setShowModal('signIn')}
          />
        </>
      )}
    </nav>
  );
}
