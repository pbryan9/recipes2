import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import { createBrowserRouter } from 'react-router-dom';

/**
 * COMPONENTS
 */
import App from '../../App';
import Home from '../../views/home/Home';
import BrowseRecipes from '../../views/recipes/BrowseRecipes';
import SingleRecipe from '../../views/recipes/SingleRecipe';
import CreateRecipeView from '../../views/create-recipe/CreateRecipeView';
import EditRecipeView from '../../views/create-recipe/EditRecipeView';

/**
 * ROUTES
 */

export default createBrowserRouter([
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
        path: '/recipes/:recipeId/edit',
        element: (
          <>
            <SignedIn>
              <EditRecipeView />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        ),
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
