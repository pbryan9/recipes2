import React, { createContext, useEffect, useState } from 'react';
import {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';
import { trpc } from '../trpc/trpc';
import useUser from '../hooks/useUser';

type FilterOption = {
  label: string;
  enabled: boolean;
};

type FilterOptions = {
  title: FilterOption;
  ingredient: FilterOption;
  procedure: FilterOption;
  tag: FilterOption;
  owned: FilterOption;
  favorites: FilterOption;
};

type OptionKey = keyof typeof defaultFilterOptions;

const defaultFilterOptions: FilterOptions = {
  title: { label: 'Recipe title', enabled: true },
  ingredient: { label: 'Ingredients', enabled: true },
  procedure: { label: 'Procedure steps', enabled: true },
  tag: { label: 'Tags', enabled: true },
  owned: { label: 'Include my recipes', enabled: true },
  favorites: { label: 'Include favorites', enabled: true },
};

export type FilterResult = {
  allMatches: FilledRecipe[];
  titleMatches: FilledRecipe[];
  authorMatches: FilledRecipe[];
  tagMatches: FilledRecipe[];
  ingredientMatches: FilledRecipe[];
  procedureMatches: FilledRecipe[];
};

type RecipesContext = {
  recipes: FilledRecipe[];
  filterIsActive: boolean;
  filterOptions: FilterOptions;
  filterResults: FilterResult;
  setFilter: (searchTerm: string) => void;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  clearFilter: () => void;
  deleteRecipe: (recipeId: string) => void;
};

const initialRecipesContext: RecipesContext = {
  recipes: [],
  filterIsActive: false,
  filterResults: {
    allMatches: [],
    titleMatches: [],
    authorMatches: [],
    tagMatches: [],
    ingredientMatches: [],
    procedureMatches: [],
  },
  filterOptions: defaultFilterOptions,
  setFilterOptions: () => null,
  setFilter: () => null,
  clearFilter: () => null,
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

  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);

  const [searchTerm, setSearchTerm] = useState('');

  const utils = trpc.useContext();

  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const { favorites, username } = useUser();

  // TODO: this is just here for convenience - should probably offload it to a tags ctx at some point
  trpc.tags.all.useQuery(undefined, { staleTime: 1000 * 60 * 10 });

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

  function clearFilter() {
    setSearchTerm('');
  }

  function setFilter(searchTerm: string) {
    setSearchTerm(searchTerm);
  }

  function deleteRecipe(recipeId: string) {
    deleteRecipeMutation.mutate({ recipeId });
  }

  useEffect(() => {
    // attach functions to context

    setRecipesContext((prev) => ({
      ...prev,
      clearFilter,
      setFilter,
      deleteRecipe,
    }));
  }, []);

  useEffect(() => {
    // update filter results either when search term changes or when a new recipes collection arrives
    // or when filter options are updated
    let filterIsActive = searchTerm !== '';

    const prefilteredResults = preFilter(
      recipesQuery.data ?? [],
      filterOptions,
      favorites ?? [],
      username ?? ''
    );
    const midFilter = filterRecipes(prefilteredResults, searchTerm);
    const postfilteredResults = postFilter(midFilter, filterOptions);
    console.log({
      recipesContext,
      filterOptions,
      midFilter,
      prefilteredResults,
      postfilteredResults,
    });

    setRecipesContext((prev) => ({
      ...prev,
      filterResults: postfilteredResults,
      filterIsActive,
    }));
  }, [searchTerm, recipesQuery.data, filterOptions]);

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
    <RecipesContext.Provider
      value={{ ...recipesContext, filterOptions, setFilterOptions }}
    >
      {children}
    </RecipesContext.Provider>
  );
}

/**
 *
 * Helper funcs below
 *
 */

function preFilter(
  recipes: FilledRecipe[],
  filterOptions: FilterOptions,
  favorites: string[],
  username: string
) {
  let recipesToRemove = new Set<FilledRecipe>();
  let res: FilledRecipe[] = [];

  for (let recipe of recipes) {
    if (!filterOptions.favorites.enabled && favorites.includes(recipe.id)) {
      recipesToRemove.add(recipe);
    }

    if (!filterOptions.owned.enabled && recipe.author.username === username) {
      recipesToRemove.add(recipe);
    }

    if (!recipesToRemove.has(recipe)) res.push(recipe);
  }

  return res;
}

function postFilter(filterResult: FilterResult, filterOptions: FilterOptions) {
  for (let opt in filterOptions) {
    switch (opt as keyof FilterOptions) {
      case 'ingredient':
        filterResult.ingredientMatches = [];
        break;
      case 'procedure':
        filterResult.procedureMatches = [];
        break;
      case 'title':
        filterResult.titleMatches = [];
        break;
      case 'tag':
        filterResult.tagMatches = [];
        break;
    }
  }

  const allMatches: Set<FilledRecipe> = new Set();

  let section: keyof FilterResult;

  for (section in filterResult) {
    if (section === 'allMatches') break;

    for (let recipe of filterResult[section]) {
      allMatches.add(recipe);
    }
  }

  filterResult.allMatches = Array.from(allMatches);

  return filterResult;
}

function filterRecipes(
  recipes: FilledRecipe[],
  searchTerm: string
): FilterResult {
  console.log({ filterRecipes_input: recipes });

  const word = searchTerm.toLowerCase();

  const filterResult = {
    allMatches: [] as FilledRecipe[],
    titleMatches: [] as FilledRecipe[],
    authorMatches: [] as FilledRecipe[],
    tagMatches: [] as FilledRecipe[],
    ingredientMatches: [] as FilledRecipe[],
    procedureMatches: [] as FilledRecipe[],
  };

  if (searchTerm === '' || !recipes.length) return filterResult;

  for (let recipe of recipes) {
    // titles
    if (recipe.title.toLowerCase().includes(word)) {
      filterResult.titleMatches.push(recipe);
    }

    // authors
    if (recipe.author.username.toLowerCase().includes(word)) {
      filterResult.authorMatches.push(recipe);
    }

    // tags
    if (
      recipe.tags.some((tag) => tag.description.toLowerCase().includes(word))
    ) {
      filterResult.tagMatches.push(recipe);
    }

    // ingredients
    const ingredients = consolidateIngredients(recipe);
    if (
      ingredients.some((step) => step.description.toLowerCase().includes(word))
    ) {
      filterResult.ingredientMatches.push(recipe);
    }

    // procedures
    const steps = consolidateSteps(recipe);
    if (steps.some((step) => step.description.toLowerCase().includes(word))) {
      filterResult.procedureMatches.push(recipe);
    }
  }

  console.log({ filterResult });

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
