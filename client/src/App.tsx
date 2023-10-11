import { Outlet } from 'react-router-dom';

import RecipesContextProvider from './utils/context/RecipesContextProvider';

import Navbar from './components/Navbar';
import ClerkProviderComponent from './utils/auth/ClerkProvider';
import TrpcProvider from './utils/trpc/TrpcProvider';

function App() {
  return (
    <ClerkProviderComponent>
      <TrpcProvider>
        <RecipesContextProvider>
          <div className='h-screen w-screen overflow-y-hidden bg-gray-800 text-white'>
            <Navbar />
            <Outlet />
          </div>
        </RecipesContextProvider>
      </TrpcProvider>
    </ClerkProviderComponent>
  );
}

export default App;
