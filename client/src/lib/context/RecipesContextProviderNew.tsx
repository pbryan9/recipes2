import React, { createContext, useEffect, useState } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import { trpc } from '../trpc/trpc';

type RecipesContext = {
  recipes: FilledRecipe[];
};

const initialRecipesContext: RecipesContext = {
  recipes: [],
};

export const RecipesContext = createContext<RecipesContext>(
  initialRecipesContext
);

type RecipesContextProviderProps = {
  children: React.ReactNode;
};

export default function RecipesContextProvider({
  children,
}: RecipesContextProviderProps) {
  const [recipesContext, setRecipesContext] = useState<RecipesContext>(
    initialRecipesContext
  );

  /**
   * Fetch all recipes from backend
   */
  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    // populate recipes in context when loading/fetching is complete
    if (
      !recipesQuery.isLoading &&
      !recipesQuery.isFetching &&
      !recipesQuery.isError
    ) {
      console.log('updating recipes context');
      setRecipesContext((prev) => ({ ...prev, recipes: recipesQuery.data }));
    }
  }, [recipesQuery.isLoading, recipesQuery.isFetching]);

  return (
    <RecipesContext.Provider value={{ ...recipesContext }}>
      {children}
    </RecipesContext.Provider>
  );
}
