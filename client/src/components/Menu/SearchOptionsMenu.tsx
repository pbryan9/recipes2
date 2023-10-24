import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';
import MenuSeparator from './MenuSeparator';
import useRecipes from '../../lib/hooks/useRecipes';
import Toggler from '../Toggler';

type SearchOptionsMenuProps = {
  label: React.ReactNode;
  resetFilter: () => void;
};

type FilterOption = {
  label: string;
  isOn: boolean;
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
  title: { label: 'Recipe title', isOn: true },
  ingredient: { label: 'Ingredients', isOn: true },
  procedure: { label: 'Procedure steps', isOn: true },
  tag: { label: 'Tags', isOn: true },
  owned: { label: 'Include my recipes', isOn: true },
  favorites: { label: 'Include favorites', isOn: true },
};

export default function SearchOptionsMenu({
  label,
  resetFilter,
}: SearchOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { filterIsActive } = useRecipes();

  const [filterOptions, setFilterOptions] =
    useState<FilterOptions>(defaultFilterOptions);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <MenuWrapper triggerLabel={label} toggleMenu={toggleMenu} isOpen={isOpen}>
      {filterIsActive && (
        <>
          <MenuItem
            onClick={() => {
              resetFilter();
              toggleMenu();
            }}
          >
            Clear filter
          </MenuItem>
          <MenuSeparator />
        </>
      )}

      {Object.keys(filterOptions).map((opt) => (
        <MenuItem
          key={opt}
          onClick={() =>
            setFilterOptions((prev) => ({
              ...prev,
              [opt]: {
                ...prev[opt as OptionKey],
                isOn: !prev[opt as OptionKey].isOn,
              },
            }))
          }
        >
          {filterOptions[opt as OptionKey].label}
          <Toggler as='div' isOn={filterOptions[opt as OptionKey].isOn} />
        </MenuItem>
      ))}

      <MenuSeparator />
      <MenuItem
        onClick={() => {
          toggleMenu();
        }}
      >
        Cancel
      </MenuItem>
    </MenuWrapper>
  );
}
