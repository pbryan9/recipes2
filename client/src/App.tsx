import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './utils/context/RecipesContextProvider';

import Navbar from './components/Navbar';
import TrpcProvider from './utils/trpc/TrpcProvider';
import UserContextProvider from './utils/context/UserContextProvider';

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
