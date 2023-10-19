import { useContext } from 'react';
import { RecipesContext } from '../context/RecipesContextProvider';

export default function useRecipes() {
  const context = useContext(RecipesContext);

  return { ...context };
}
