import { createBrowserRouter } from 'react-router-dom';

/**
 * COMPONENTS
 */
import App from '../../App';
import Home from '../../views/home/Home';
import CreateRecipeView from '../../views/create-recipe/CreateRecipeView';
import BrowseRecipesView from '../../views/recipes/BrowseRecipesView';

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
        path: '/recipes/edit',
        element: <CreateRecipeView />,
      },
      {
        path: '/recipes/create-new-recipe',
        element: <CreateRecipeView />,
      },
    ],
  },
]);
