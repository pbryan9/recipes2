import React, { createContext, useEffect, useState } from 'react';
import type {
  FilledRecipe,
  Ingredient,
  ProcedureStep,
} from '../../../../api-server/db/recipes/getRecipeById';
import useRecipes from '../hooks/useRecipes';
import useUser from '../hooks/useUser';

export type FilterContext = {
  filterOptions: FilterOptions;
  toggleFilterOption: (option: FilterOptionKey) => void;
  restoreDefaultFilterOptions: () => void;
  updateFilter: (searchTerm: string) => void;
  filterResults: FilterResult;
  searchTerm: string;
  clearFilter: () => void;
  prefilterRecipes: (recipes: FilledRecipe[]) => FilledRecipe[];
};

type FilterContextProviderProps = {
  children: React.ReactNode;
};

export type FilterOption = {
  label: string;
  enabled: boolean;
};

export type FilterResult = {
  allMatches: FilledRecipe[];
  titleMatches: FilledRecipe[];
  authorMatches: FilledRecipe[];
  tagMatches: FilledRecipe[];
  ingredientMatches: FilledRecipe[];
  procedureMatches: FilledRecipe[];
};

export type FilterResultKey = keyof FilterResult;

export const defaultFilterOptions = {
  title: { label: 'Recipe title', enabled: true },
  author: { label: 'Recipe author', enabled: true },
  ingredient: { label: 'Ingredients', enabled: true },
  procedure: { label: 'Procedure steps', enabled: true },
  tag: { label: 'Tags', enabled: true },
  owned: { label: 'My recipes only', enabled: false },
  favorites: { label: 'Favorites only', enabled: false },
  matchAll: { label: 'Must match every word', enabled: false },
};

export type FilterOptions = typeof defaultFilterOptions;
export type FilterOptionKey = keyof typeof defaultFilterOptions;

const filterResultTemplate: FilterResult = {
  allMatches: [],
  authorMatches: [],
  ingredientMatches: [],
  procedureMatches: [],
  tagMatches: [],
  titleMatches: [],
};

const initialFilterContext: FilterContext = {
  filterOptions: defaultFilterOptions,
  toggleFilterOption: () => null,
  restoreDefaultFilterOptions: () => null,
  updateFilter: () => null,
  filterResults: filterResultTemplate,
  searchTerm: '',
  clearFilter: () => null,
  prefilterRecipes: () => [],
};

export const FilterContext = createContext(initialFilterContext);

// ! Main function starts here

export default function FilterContextProvider({
  children,
}: FilterContextProviderProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilterContext.searchTerm);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(() => {
    let storedFilterOptions = localStorage.getItem('filter-options');
    let parsedFilterOptions: FilterOptions | undefined = undefined;
    if (storedFilterOptions)
      parsedFilterOptions = JSON.parse(storedFilterOptions) as FilterOptions;

    // if we successfully pulled filter opts from storage, check that all properties are represented
    if (
      parsedFilterOptions &&
      Object.keys(parsedFilterOptions).every((key) =>
        Object.keys(defaultFilterOptions).includes(key)
      )
    )
      return parsedFilterOptions;

    // otherwise, just use the default
    return defaultFilterOptions;
  });
  const [filterResults, setFilterResults] = useState<FilterResult>(
    initialFilterContext.filterResults
  );

  const { recipes } = useRecipes();
  const { isLoggedIn, username, favorites } = useUser();

  useEffect(() => {
    if (searchTerm !== '') {
      setFilterResults(postfilterRecipes(filterRecipes(prefilterRecipes())));
    }
  }, [searchTerm, filterOptions]);

  useEffect(() => {
    // save filter options to localstorage for persistence
    localStorage.setItem('filter-options', JSON.stringify(filterOptions));
  }, [filterOptions]);

  function toggleFilterOption(option: FilterOptionKey) {
    setFilterOptions((prev) => ({
      ...prev,
      [option]: { label: prev[option].label, enabled: !prev[option].enabled },
    }));
  }

  function restoreDefaultFilterOptions() {
    setFilterOptions(initialFilterContext.filterOptions);
  }

  function updateFilter(searchTerm: string) {
    if (searchTerm !== '') setSearchTerm(searchTerm);
    else clearFilter();
  }

  function prefilterRecipes(): FilledRecipe[] {
    // check certain filter options & remove recipes from population as needed
    // return prefiltered results

    let prefilteredRecipes = [];

    const favoritesOnly =
      isLoggedIn && filterOptions.favorites.enabled === true;
    const ownedOnly = isLoggedIn && filterOptions.owned.enabled === true;

    for (let recipe of recipes) {
      if (favoritesOnly && !favorites.includes(recipe.id)) {
        continue;
      }

      if (ownedOnly && username !== recipe.author.username) {
        continue;
      }

      prefilteredRecipes.push(recipe);
    }

    return prefilteredRecipes;
  }

  function filterRecipes(recipes: FilledRecipe[]): FilterResult {
    // to be used after prefilter
    // returns organized object of filter results
    let res: FilterResult = {
      allMatches: [],
      authorMatches: [],
      ingredientMatches: [],
      procedureMatches: [],
      tagMatches: [],
      titleMatches: [],
    };

    if (searchTerm === '') return res;

    const matchAll = filterOptions.matchAll.enabled;

    for (let recipe of recipes) {
      // title matches
      if (
        filterOptions.title.enabled &&
        checkForMatches({
          findWord: searchTerm,
          within: recipe.title,
          matchAll,
        })
      ) {
        res.titleMatches.push(recipe);
      }

      // author matches
      if (
        filterOptions.author.enabled &&
        checkForMatches({
          findWord: searchTerm,
          within: recipe.author.username,
          matchAll,
        })
      ) {
        res.authorMatches.push(recipe);
      }

      // ingredient matches
      if (filterOptions.ingredient.enabled) {
        let consolidatedIngredients = consolidateIngredients(recipe)
          .map((ing) => ing.description)
          .join(' ');
        if (
          checkForMatches({
            findWord: searchTerm,
            within: consolidatedIngredients,
            matchAll,
          })
        ) {
          res.ingredientMatches.push(recipe);
        }
      }

      // procedure matches
      if (filterOptions.procedure.enabled) {
        let consolidatedSteps = consolidateSteps(recipe)
          .map((step) => step.description)
          .join(' ');

        if (
          checkForMatches({
            findWord: searchTerm,
            within: consolidatedSteps,
            matchAll,
          })
        ) {
          res.procedureMatches.push(recipe);
        }
      }

      // tag matches
      if (filterOptions.tag.enabled) {
        let tags = recipe.tags
          .map((tag) => tag.description.toLowerCase())
          .join(' ');

        if (
          checkForMatches({
            findWord: searchTerm,
            within: tags,
            matchAll,
          })
        ) {
          res.tagMatches.push(recipe);
        }
      }
    }

    return res;
  }

  function postfilterRecipes(filteredRecipes: FilterResult) {
    // to be used after filterRecipes
    // takes in organized object of filter results
    // builds up allMatches category & sorts by # of hits (max 1 per category, for now)
    // returns organized object of filter results

    let tempAllMatches = new Set<FilledRecipe>();
    let hitCounter = new Map<string, { recipe: FilledRecipe; hits: number }>();

    for (let category in filteredRecipes) {
      if (
        category === 'allMatches' ||
        filteredRecipes[category as FilterResultKey].length === 0
      )
        continue;

      for (let recipe of filteredRecipes[category as FilterResultKey]) {
        if (hitCounter.has(recipe.id)) {
          hitCounter.get(recipe.id)!.hits += 1;
        } else {
          hitCounter.set(recipe.id, { recipe, hits: 1 });
        }

        tempAllMatches.add(recipe);
      }
    }

    let tempMatchArr = Array.from(tempAllMatches).sort(
      (a, b) => hitCounter.get(b.id)!.hits - hitCounter.get(a.id)!.hits
    );

    filteredRecipes.allMatches = tempMatchArr;

    return filteredRecipes;
  }

  function clearFilter() {
    setSearchTerm('');
    setFilterResults(filterResultTemplate);
  }

  return (
    <FilterContext.Provider
      value={{
        filterOptions,
        filterResults,
        toggleFilterOption,
        restoreDefaultFilterOptions,
        updateFilter,
        searchTerm,
        clearFilter,
        prefilterRecipes,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

/**
 *
 * Helper funcs below
 *
 */

function checkForMatches({
  findWord,
  within,
  matchAll = false,
}: {
  findWord: string;
  within: string;
  matchAll?: boolean;
}) {
  const splitter = new RegExp(/\W/);

  let searchWord = new Set(findWord.toLowerCase().split(splitter));
  let searchWithin = new Set(within.toLowerCase().split(splitter));

  searchWord.delete('');
  searchWithin.delete('');

  const wordArr = Array.from(searchWord.values());
  const withinArr = Array.from(searchWithin.values());

  if (matchAll) {
    return wordArr.every((word) =>
      withinArr.some((withinWord) => withinWord.includes(word))
    );
  }

  return wordArr.some((word) =>
    withinArr.some((withinWord) => {
      return withinWord.includes(word);
    })
  );
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
