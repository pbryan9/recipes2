import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';
import MenuSeparator from './MenuSeparator';
import useRecipes from '../../lib/hooks/useRecipes';
import Toggler from '../Toggler';
import useFilter from '../../lib/hooks/useFilter';
import { FilterOptionKey } from '../../lib/context/FilterContextProvider';

type SearchOptionsMenuProps = {
  label: React.ReactNode;
  resetFilter: () => void;
};

export default function SearchOptionsMenu({
  label,
  resetFilter,
}: SearchOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { filterOptions, toggleFilterOption, searchTerm } = useFilter();

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  const filterIsActive = searchTerm !== '';

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
          onClick={() => toggleFilterOption(opt as FilterOptionKey)}
        >
          {filterOptions[opt as FilterOptionKey].label}
          <Toggler
            as='div'
            isOn={filterOptions[opt as FilterOptionKey].enabled}
          />
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
