import React, { createContext } from 'react';
import useRecipes, {
  type RecipesState,
  initialRecipesState,
  RecipeAction,
} from '../hooks/useRecipes';

type RecipesContextProviderProps = {
  children: React.ReactNode;
};

export type RecipesContextType = RecipesState & {
  dispatch: React.Dispatch<RecipeAction> | null;
};

export const RecipesContext = createContext<RecipesContextType>({
  ...initialRecipesState,
  dispatch: null,
});

export default function RecipesContextProvider({
  children,
}: RecipesContextProviderProps) {
  const { recipesState, dispatch } = useRecipes();

  return (
    <RecipesContext.Provider value={{ ...recipesState, dispatch }}>
      {children}
    </RecipesContext.Provider>
  );
}
