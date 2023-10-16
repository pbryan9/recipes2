import { useContext } from 'react';
import { RecipesContext } from '../context/RecipesContextProviderNew';

export default function useRecipes() {
  const context = useContext(RecipesContext);

  return { ...context };
}
