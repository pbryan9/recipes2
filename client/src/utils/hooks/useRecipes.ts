import { useEffect, useReducer } from 'react';
import { trpc, type RouterOutputs } from '../trpc';
import {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';

export type RecipeActionType =
  | 'refresh'
  | 'set_filter'
  | 'clear_filter'
  | 'loading_start'
  | 'loading_complete'
  | 'error';

type Recipe = RouterOutputs['recipes']['byRecipeId'];

export type RecipeAction = {
  type: RecipeActionType;
  payload?: {
    recipeArray?: Recipe[];
    searchTerm?: string;
  };
};

export type RecipesState = {
  allRecipes: Recipe[];
  ingredientMatches: Recipe[];
  tagMatches: Recipe[];
  titleMatches: Recipe[];
  procedureMatches: Recipe[];
  searchTerm: string;
  isLoading: boolean;
  isError: boolean;
};

export const initialRecipesState: RecipesState = {
  allRecipes: [],
  ingredientMatches: [],
  tagMatches: [],
  titleMatches: [],
  procedureMatches: [],
  searchTerm: '',
  isLoading: false,
  isError: false,
};

export default function useRecipes() {
  const allRecipes = trpc.recipes.all.useQuery(undefined, {
    staleTime: 1000 * 60 * 1,
  });

  const [recipesState, dispatch] = useReducer<typeof recipesReducer>(
    recipesReducer,
    initialRecipesState
  );

  useEffect(() => {
    if (allRecipes.isLoading) dispatch({ type: 'loading_start' });
    else if (allRecipes.error) {
      dispatch({ type: 'error' });
    } else {
      dispatch({ type: 'refresh', payload: { recipeArray: allRecipes.data } });
    }
  }, [allRecipes.isLoading, allRecipes.dataUpdatedAt]);

  function recipesReducer(
    state: RecipesState,
    action: RecipeAction
  ): RecipesState {
    switch (action.type) {
      case 'refresh':
        if (!action.payload?.recipeArray)
          throw new Error('Must provide new recipe array.');
        return {
          ...state,
          isLoading: false,
          isError: false,
          allRecipes: action.payload.recipeArray,
        };

      case 'set_filter':
        if (action.payload?.searchTerm === undefined)
          throw new Error('Must provide search term.');
        return {
          ...state,
          ...filterRecipes(action.payload?.searchTerm, state.allRecipes),
          searchTerm: action.payload.searchTerm,
        };

      case 'clear_filter':
        if (state.searchTerm === '') return state;
        return {
          ...initialRecipesState,
          allRecipes: state.allRecipes,
        };

      case 'loading_start':
        if (state.isLoading) return state;
        return { ...state, isLoading: true };

      case 'loading_complete':
        if (!state.isLoading) return state;
        return { ...state, isLoading: false };

      case 'error':
        if (!state.isLoading) return state;
        return { ...state, isLoading: false, isError: true };

      default:
        throw new Error('Invalid action type');
    }
  }

  return { recipesState, dispatch };
}

function consolidateIngredients(recipe: Recipe) {
  let res: Ingredient[] = [];

  for (let group of recipe?.ingredientGroups ?? []) {
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

function filterRecipes(keyword: string, allRecipes: Recipe[]) {
  const results: Pick<
    RecipesState,
    'ingredientMatches' | 'procedureMatches' | 'tagMatches' | 'titleMatches'
  > = {
    ingredientMatches: [],
    tagMatches: [],
    titleMatches: [],
    procedureMatches: [],
  };

  if (!keyword || !allRecipes || !allRecipes.length) return results;

  const searchTerm = keyword.toLowerCase();

  for (let recipe of allRecipes) {
    // test for ingredient matches
    if (!recipe) continue;

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
