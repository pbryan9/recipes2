import { useEffect, useReducer } from 'react';
import { trpc } from '../trpc';
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

export type RecipeAction = {
  type: RecipeActionType;
  payload?: {
    recipeArray?: FilledRecipe[];
    searchTerm?: string;
  };
};

export type RecipesState = {
  allRecipes: FilledRecipe[];
  ingredientMatches: FilledRecipe[];
  tagMatches: FilledRecipe[];
  titleMatches: FilledRecipe[];
  procedureMatches: FilledRecipe[];
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

export default function useBrowseRecipes() {
  const utils = trpc.useContext();

  useEffect(() => {
    fetchRecipes().then((data) => {
      dispatch({ type: 'refresh', payload: { recipeArray: data } });
    });
  }, []);

  async function fetchRecipes() {
    dispatch({ type: 'loading_start' });

    const allRecipes = await utils.getAllRecipes.fetch();

    dispatch({ type: 'loading_complete' });

    return allRecipes;
  }

  function recipesReducer(
    state: RecipesState,
    action: RecipeAction
  ): RecipesState {
    switch (action.type) {
      case 'refresh':
        if (!action.payload?.recipeArray)
          throw new Error('Must provide new recipe array.');
        return { ...state, allRecipes: action.payload.recipeArray };

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

      default:
        throw new Error('Invalid action type');
    }
  }

  const [recipesState, dispatch] = useReducer<typeof recipesReducer>(
    recipesReducer,
    initialRecipesState
  );

  return { recipesState, dispatch };
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

  const results: Pick<
    RecipesState,
    'ingredientMatches' | 'procedureMatches' | 'tagMatches' | 'titleMatches'
  > = {
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
