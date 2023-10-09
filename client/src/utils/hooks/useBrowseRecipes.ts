import { useEffect, useState } from 'react';
import { trpc } from '../trpc';
import {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';

export default function useBrowseRecipes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState<
    Record<string, FilledRecipe[]>
  >({
    allRecipes: [],
    ingredientMatches: [],
    tagMatches: [],
    titleMatches: [],
    procedureMatches: [],
  });

  const { data: recipes, isLoading, isError } = trpc.getAllRecipes.useQuery();

  useEffect(() => {
    if (!recipes) return;

    setFilteredRecipes((prev) => ({ ...prev, allRecipes: recipes }));
  }, [recipes]);

  useEffect(() => {
    setFilter(searchTerm);
  }, [searchTerm]);

  console.log('recipes:', recipes);

  function setFilter(searchTerm: string) {
    if (searchTerm === '') {
      setFilteredRecipes((prev) => ({ ...prev, allRecipes: recipes || [] }));
      return;
    }

    filterRecipes(searchTerm, recipes!);
    setFilteredRecipes(filterRecipes(searchTerm, recipes || []));
  }

  function consolidateIngredients(recipe: FilledRecipe) {
    let res: Ingredient[] = [];

    for (let group of recipe.ingredientGroups) {
      res = [...res, ...group.ingredients];
    }

    return res;
  }

  function consolidateSteps(recipe: FilledRecipe) {
    let res: ProcedureStep[] = [];

    for (let group of recipe.procedureGroups) {
      // res = [...res, ...group.procedureSteps];
      res.push(...group.procedureSteps);
    }

    return res;
  }

  function filterRecipes(keyword: string, allRecipes: FilledRecipe[]) {
    const searchTerm = keyword.toLowerCase();

    const results: Record<string, FilledRecipe[]> = {
      allRecipes: [],
      ingredientMatches: [],
      tagMatches: [],
      titleMatches: [],
      procedureMatches: [],
    };

    for (let recipe of allRecipes) {
      // test for ingredient matches
      let ingredients = consolidateIngredients(recipe);

      for (let ingredient of ingredients) {
        if (ingredient.description.toLowerCase().includes(searchTerm)) {
          results.ingredientMatches.push(recipe);
          break;
        }
      }

      // test for tag matches
      if (
        recipe.tags?.some(
          (tag) =>
            tag.description.toLowerCase().includes(searchTerm) ||
            tag.tagGroup?.toLowerCase().includes(searchTerm)
        )
      ) {
        results.tagMatches.push(recipe);
      }

      // test for title matches
      if (recipe.title.toLowerCase().includes(searchTerm)) {
        results.titleMatches.push(recipe);
      }

      // test for procedure matches
      const steps = consolidateSteps(recipe);

      for (let step of steps) {
        if (step.description.toLowerCase().includes(searchTerm)) {
          results.procedureMatches.push(recipe);
          break;
        }
      }
    }

    return results;
  }

  return { searchTerm, setSearchTerm, filteredRecipes, isLoading, isError };
}
