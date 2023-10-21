import useUser from '../../lib/hooks/useUser';
import { useState } from 'react';
import Button from '../../components/Button';
import SignInModal from '../../components/SignInModal';

export default function Home() {
  const { isLoggedIn } = useUser();
  const [showSignin, setShowSignin] = useState(false);

  return (
    <main className='p-6 '>
      <h1 className='display-large'>Recipes</h1>
      {!isLoggedIn && (
        <Button onClick={() => setShowSignin(true)}>Sign in</Button>
      )}
      {showSignin && <SignInModal dismissModal={() => setShowSignin(false)} />}
    </main>
  );
}
