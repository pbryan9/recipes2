import React, { useState } from 'react';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';
import MenuSeparator from './MenuSeparator';
import Toggler from '../Toggler';
import useFilter from '../../lib/hooks/useFilter';
import { FilterOptionKey } from '../../lib/context/FilterContextProvider';
import MenuLabel from './MenuLabel';

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

  const searchSegment: FilterOptionKey[] = [
    'title',
    'author',
    'ingredient',
    'procedure',
    'tag',
    'matchAll',
  ];
  const filterSegment: FilterOptionKey[] = ['favorites', 'owned'];

  return (
    <MenuWrapper triggerLabel={label} toggleMenu={toggleMenu} isOpen={isOpen}>
      <MenuLabel>Search options:</MenuLabel>
      {searchSegment.map((opt) => (
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

      <MenuLabel>Filter recipes:</MenuLabel>
      {filterSegment.map((opt) => (
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
