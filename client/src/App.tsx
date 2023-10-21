import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './lib/context/RecipesContextProvider';

import TrpcProvider from './lib/trpc/TrpcProvider';
import UserContextProvider from './lib/context/UserContextProvider';
import NavRail from './components/NavRail/NavRail';
import TagContextProvider from './lib/context/TagsContextProvider';
import ModalContextProvider from './lib/context/ModalContextProvider';

function App() {
  return (
    <TrpcProvider>
      <TagContextProvider>
        <UserContextProvider>
          <RecipesContextProvider>
            <ModalContextProvider>
              <div className='h-screen w-screen background on-background-text flex justify-start items-start p-6 pl-0 overflow-hidden'>
                <NavRail />
                <Outlet />
              </div>
            </ModalContextProvider>
          </RecipesContextProvider>
        </UserContextProvider>
      </TagContextProvider>
    </TrpcProvider>
  );
}

export default App;
