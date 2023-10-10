import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import Home from './views/home/Home.tsx';
import BrowseRecipes from './views/recipes/BrowseRecipes.tsx';
import SingleRecipe from './views/recipes/SingleRecipe.tsx';
import CreateRecipeView from './views/create-recipe/CreateRecipeView.tsx';

import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/recipes',
        element: <BrowseRecipes />,
      },
      {
        path: '/recipes/:recipeId',
        element: <SingleRecipe />,
      },
      {
        path: '/recipes/create-new-recipe',
        element: (
          <>
            <SignedIn>
              <CreateRecipeView />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
