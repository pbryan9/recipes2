import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './lib/context/RecipesContextProvider';
import NewRecipesContextProvider from './lib/context/RecipesContextProviderNew';

import Navbar from './components/Navbar';
import TrpcProvider from './lib/trpc/TrpcProvider';
import UserContextProvider from './lib/context/UserContextProvider';
import NavRail from './components/NavRail/NavRail';

function App() {
  return (
    <TrpcProvider>
      <UserContextProvider>
        <RecipesContextProvider>
          <NewRecipesContextProvider>
            <div className='h-screen w-screen background on-background-text flex justify-start items-start p-6 pl-0'>
              {/* <Navbar /> */}
              <NavRail />
              <Outlet />
            </div>
          </NewRecipesContextProvider>
        </RecipesContextProvider>
      </UserContextProvider>
    </TrpcProvider>
  );
}

export default App;
