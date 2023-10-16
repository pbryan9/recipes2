import React, { createContext, useEffect, useState } from 'react';
import {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';
import { trpc } from '../trpc/trpc';

type FilterResult = {
  titleMatches: FilledRecipe[];
  authorMatches: FilledRecipe[];
  tagMatches: FilledRecipe[];
  ingredientMatches: FilledRecipe[];
  procedureMatches: FilledRecipe[];
};

type RecipesContext = {
  recipes: FilledRecipe[];
  filterResults: FilterResult;
  setFilter?: (searchTerm: string) => void;
  clearFilter?: () => void;
};

const initialRecipesContext: RecipesContext = {
  recipes: [],
  filterResults: {
    titleMatches: [],
    authorMatches: [],
    tagMatches: [],
    ingredientMatches: [],
    procedureMatches: [],
  },
  setFilter: undefined,
  clearFilter: undefined,
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

  const [searchTerm, setSearchTerm] = useState('');

  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    // populate context functions

    if (!recipesContext.clearFilter) {
      recipesContext.clearFilter = () => setSearchTerm('');
    }

    recipesContext.setFilter = (searchTerm: string) => {
      setSearchTerm(searchTerm);
    };
  }, []);

  useEffect(() => {
    // update filter results either when search term changes or when a new recipes collection arrives

    const filterResults = filterRecipes(recipesQuery.data ?? [], searchTerm);

    setRecipesContext((prev) => ({ ...prev, filterResults }));
  }, [searchTerm, recipesQuery.data]);

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

/**
 *
 * Helper funcs below
 *
 */

function filterRecipes(
  recipes: FilledRecipe[],
  searchTerm: string
): FilterResult {
  const word = searchTerm.toLowerCase();

  const filterResult = {
    titleMatches: [] as FilledRecipe[],
    authorMatches: [] as FilledRecipe[],
    tagMatches: [] as FilledRecipe[],
    ingredientMatches: [] as FilledRecipe[],
    procedureMatches: [] as FilledRecipe[],
  };

  if (searchTerm === '' || !recipes.length) return filterResult;

  for (let recipe of recipes) {
    // titles
    if (recipe.title.toLowerCase().includes(word))
      filterResult.titleMatches.push(recipe);

    // authors
    if (recipe.author.username.toLowerCase().includes(word))
      filterResult.authorMatches.push(recipe);

    // tags
    if (recipe.tags.some((tag) => tag.description.toLowerCase().includes(word)))
      filterResult.tagMatches.push(recipe);

    // ingredients
    const ingredients = consolidateIngredients(recipe);
    if (
      ingredients.some((step) => step.description.toLowerCase().includes(word))
    )
      filterResult.ingredientMatches.push(recipe);

    // procedures
    const steps = consolidateSteps(recipe);
    if (steps.some((step) => step.description.toLowerCase().includes(word)))
      filterResult.procedureMatches.push(recipe);
  }

  return filterResult;
}

function consolidateSteps(recipe: FilledRecipe) {
  let res: ProcedureStep[] = [];

  for (let group of recipe.procedureGroups) {
    res.push(...group.procedureSteps);
  }

  return res;
}

function consolidateIngredients(recipe: FilledRecipe) {
  let res: Ingredient[] = [];

  for (let group of recipe?.ingredientGroups ?? []) {
    res.push(...group.ingredients);
  }

  return res;
}
