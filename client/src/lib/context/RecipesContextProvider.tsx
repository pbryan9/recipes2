import React, { createContext, useEffect, useState } from 'react';
import type { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import { trpc } from '../trpc/trpc';

type RecipesContext = {
  recipes: FilledRecipe[];
  deleteRecipe: (recipeId: string) => void;
  isLoading: boolean;
};

const initialRecipesContext: RecipesContext = {
  recipes: [],
  deleteRecipe: () => null,
  isLoading: false,
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
  // chose to use state var here for easy optimistic deletes
  const [recipes, setRecipes] = useState<FilledRecipe[]>([]);

  const utils = trpc.useContext();

  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const deleteRecipeMutation = trpc.recipes.delete.useMutation({
    onMutate({ recipeId }) {
      // optimistic delete
      setRecipes((prev) => [
        ...prev.filter((recipe) => recipe.id !== recipeId),
      ]);
    },
    onSuccess(_, { recipeId }) {
      utils.recipes.all.invalidate();
      utils.recipes.byRecipeId.invalidate({ recipeId });
    },
  });

  function deleteRecipe(recipeId: string) {
    deleteRecipeMutation.mutate({ recipeId });
  }

  useEffect(() => {
    // populate recipes in context when loading/fetching is complete

    if (
      !recipesQuery.isLoading &&
      !recipesQuery.isFetching &&
      !recipesQuery.isError
    ) {
      setRecipes(
        recipesQuery.data.sort((a, b) => (a.title < b.title ? -1 : 1))
      );
    }
  }, [recipesQuery.isLoading, recipesQuery.isFetching]);

  return (
    <RecipesContext.Provider
      value={{
        recipes,
        isLoading: recipesQuery.isInitialLoading,
        deleteRecipe,
      }}
    >
      {children}
    </RecipesContext.Provider>
  );
}
