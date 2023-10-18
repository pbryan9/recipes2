import { createBrowserRouter } from 'react-router-dom';

/**
 * COMPONENTS
 */
import App from '../../App';
import Home from '../../views/home/Home';
import SingleRecipe from '../../views/recipes/SingleRecipe';
import CreateRecipeView from '../../views/create-recipe/CreateRecipeView';
import EditRecipeView from '../../views/create-recipe/EditRecipeView';
import SignInView from '../../views/sign-in/SignInView';
import SignUpView from '../../views/sign-up/SignUpView';
import BrowseRecipesView from '../../views/recipes/NewBrowseView';

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
        element: <BrowseRecipesView />,
      },
      {
        path: '/recipes/:recipeId',
        element: <SingleRecipe />,
      },
      {
        path: '/recipes/:recipeId/edit',
        element: <EditRecipeView />,
      },
      {
        path: '/recipes/create-new-recipe',
        element: <CreateRecipeView />,
      },
      {
        path: '/sign-in',
        element: <SignInView />,
      },
      {
        path: '/sign-up',
        element: <SignUpView />,
      },
    ],
  },
]);
