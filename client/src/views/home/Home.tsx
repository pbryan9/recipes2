import { Link } from 'react-router-dom';
import useUser from '../../lib/hooks/useUser';

export default function Home() {
  const { isLoggedIn, logout } = useUser();

  return (
    <main className='p-6 basis-8/12 flex flex-col gap-5 overflow-y-auto min-h-[calc(100vh_-_80px)]'>
      {isLoggedIn ? (
        <button className='w-fit' onClick={() => logout!()}>
          Sign Out
        </button>
      ) : (
        <>
          <Link className='w-fit' to='/sign-in'>
            Sign In
          </Link>
          <Link className='w-fit' to='/sign-up'>
            Sign Up
          </Link>
        </>
      )}

      <Link className='w-fit' to='/recipes'>
        Browse Recipes
      </Link>
      {isLoggedIn && (
        <Link className='w-fit' to='/recipes/create-new-recipe'>
          New Recipe Form
        </Link>
      )}
    </main>
  );
}
