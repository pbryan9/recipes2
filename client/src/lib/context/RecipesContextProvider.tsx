import React, { createContext, useEffect, useState } from 'react';
import type { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import { trpc } from '../trpc/trpc';

type RecipesContext = {
  recipes: FilledRecipe[];
  deleteRecipe: (recipeId: string) => void;
};

const initialRecipesContext: RecipesContext = {
  recipes: [],
  deleteRecipe: () => null,
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

  const utils = trpc.useContext();

  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const deleteRecipeMutation = trpc.recipes.delete.useMutation({
    onSuccess(_, { recipeId }) {
      setRecipesContext((prev) => ({
        ...prev,
        recipes: prev.recipes.filter(({ id }) => id !== recipeId),
      }));
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId });
    },
  });

  function deleteRecipe(recipeId: string) {
    deleteRecipeMutation.mutate({ recipeId });
  }

  useEffect(() => {
    // attach functions to context

    setRecipesContext((prev) => ({
      ...prev,
      deleteRecipe,
    }));
  }, []);

  useEffect(() => {
    // populate recipes in context when loading/fetching is complete

    if (
      !recipesQuery.isLoading &&
      !recipesQuery.isFetching &&
      !recipesQuery.isError
    ) {
      setRecipesContext((prev) => ({
        ...prev,
        recipes: recipesQuery.data.sort((a, b) => (a.title < b.title ? -1 : 1)),
      }));
    }
  }, [recipesQuery.isLoading, recipesQuery.isFetching]);

  return (
    <RecipesContext.Provider value={{ ...recipesContext }}>
      {children}
    </RecipesContext.Provider>
  );
}
