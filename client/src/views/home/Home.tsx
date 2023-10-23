import useUser from '../../lib/hooks/useUser';
import { useEffect, useState } from 'react';
import Button from '../../components/Button';
import SignInModal from '../../components/Modals/SignInModal';
import LoginIcon from '../../assets/icons/LoginIcon';
import { useNavigate } from 'react-router-dom';
import RecipePotIcon from '../../assets/icons/RecipePotIcon';

export default function Home() {
  const { isLoggedIn } = useUser();
  const [showSignin, setShowSignin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Recipes';
  }, []);

  return (
    <main className='p-6 flex flex-col gap-6'>
      {showSignin && <SignInModal dismissModal={() => setShowSignin(false)} />}
      <h1 className='display-large'>Recipes</h1>
      {!isLoggedIn && (
        <Button icon={<LoginIcon />} onClick={() => setShowSignin(true)}>
          Sign in
        </Button>
      )}
      <Button
        variant='outline'
        icon={<RecipePotIcon />}
        onClick={() => navigate('/recipes')}
      >
        Browse recipes
      </Button>
    </main>
  );
}
