import { useMemo, useState } from 'react';
import { trpc } from '../trpc/trpc';
import {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';

export default function useRecipes() {
  const [searchTerm, setSearchTerm] = useState('');

  const recipesQuery = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 10,
  });

  const filterResults = useMemo(
    () => filterRecipes(recipesQuery.data ?? [], searchTerm),
    [recipesQuery.data, searchTerm]
  );

  function setFilter(searchTerm: string) {
    if (typeof searchTerm !== 'string')
      throw new Error('Must provide a string to filter by.');

    setSearchTerm(searchTerm);
  }

  function filterRecipes(recipes: FilledRecipe[], searchTerm: string) {
    const word = searchTerm.toLowerCase();

    const filterResult = {
      titleMatches: [] as FilledRecipe[],
      authorMatches: [] as FilledRecipe[],
      tagMatches: [] as FilledRecipe[],
      ingredientMatches: [] as FilledRecipe[],
      procedureMatches: [] as FilledRecipe[],
    };

    if (searchTerm === '' || !recipes.length) return [];

    for (let recipe of recipes) {
      // titles
      if (recipe.title.toLowerCase().includes(word))
        filterResult.titleMatches.push(recipe);

      // authors
      if (recipe.author.username.toLowerCase().includes(word))
        filterResult.authorMatches.push(recipe);

      // tags
      if (
        recipe.tags.some((tag) => tag.description.toLowerCase().includes(word))
      )
        filterResult.tagMatches.push(recipe);

      // ingredients
      const ingredients = consolidateIngredients(recipe);
      if (
        ingredients.some((step) =>
          step.description.toLowerCase().includes(word)
        )
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

  const recipes = recipesQuery.data;

  return { recipes, filterResults, setFilter };
}
