import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './lib/context/RecipesContextProvider';

import Navbar from './components/Navbar';
import TrpcProvider from './lib/trpc/TrpcProvider';
import UserContextProvider from './lib/context/UserContextProvider';

function App() {
  return (
    <TrpcProvider>
      <UserContextProvider>
        <RecipesContextProvider>
          <div className='h-screen w-screen overflow-y-hidden bg-gray-800 text-white'>
            <Navbar />
            <Outlet />
          </div>
        </RecipesContextProvider>
      </UserContextProvider>
    </TrpcProvider>
  );
}

export default App;
