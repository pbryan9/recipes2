import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import CreateRecipeIcon from '../../assets/icons/NewIcon';
import RecipePotIcon from '../../assets/icons/RecipePotIcon';
import NavRailButton from './NavRailButton';
import useUser from '../../lib/hooks/useUser';
import LoginIcon from '../../assets/icons/LoginIcon';
import EditIcon from '../../assets/icons/EditIcon';
import useRecipes from '../../lib/hooks/useRecipes';
import TrashIcon from '../../assets/icons/TrashIcon';
import SignUpIcon from '../../assets/icons/SignUpIcon';
import { useModal } from '../../lib/context/ModalContextProvider';
import UserOptionsMenu from '../Menu/UserOptionsMenu';

export default function NavRail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn, username } = useUser();
  const { openModal } = useModal();
  const { recipes, deleteRecipe } = useRecipes();

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
    <nav className='w-20 mt-20 relative left-0 top-20 flex flex-col items-center gap-3 on-background-text shrink-0 print:hidden'>
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

      {/* {isLoggedIn && (
        <NavRailButton
          icon={<SettingsIcon />}
          label='Color'
          onClick={() => openModal('colorChange')}
        />
      )}

      {isLoggedIn && (
        <NavRailButton
          icon={<LogoutIcon />}
          label='Sign out'
          onClick={() => logout()}
        />
      )} */}

      {!isLoggedIn && (
        <>
          <NavRailButton
            icon={<SignUpIcon />}
            label='Sign up'
            onClick={() => openModal('signUp')}
          />
          <NavRailButton
            icon={<LoginIcon />}
            label='Sign in'
            onClick={() => openModal('signIn')}
          />
        </>
      )}

      {isLoggedIn && (
        <NavRailButton
          icon={<UserOptionsMenu />}
          label=''
          onClick={() => null}
        />
      )}
    </nav>
  );
}
