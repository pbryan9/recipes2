import React, { useEffect, useState } from 'react';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';
import MenuSeparator from './MenuSeparator';
import Toggler from '../Toggler';
import useFilter from '../../lib/hooks/useFilter';
import { FilterOptionKey } from '../../lib/context/FilterContextProvider';
import MenuLabel from './MenuLabel';
import useUser from '../../lib/hooks/useUser';
import Button from '../Button';
import ResetIcon from '../../assets/icons/ResetIcon';
import Submenu from './Submenu';
import TagCollection from './TagCollection';

type SearchOptionsMenuProps = {
  label: React.ReactNode;
  resetFilter: () => void;
};

export default function SearchOptionsMenu({
  label,
  resetFilter,
}: SearchOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const {
    filterOptions,
    toggleFilterOption,
    restoreDefaultFilterOptions,
    searchTerm,
  } = useFilter();
  const { isLoggedIn } = useUser();

  function toggleMenu(e?: MouseEvent) {
    setIsOpen((prev) => !prev);

    if (e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
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
    <MenuWrapper
      triggerLabel={label}
      toggleMenu={toggleMenu}
      isOpen={isOpen}
      mousePos={mousePos}
    >
      <Submenu caption='Search options'>
        <MenuItem onClick={restoreDefaultFilterOptions}>
          Restore default options
          <ResetIcon />
        </MenuItem>

        <MenuSeparator />

        {searchSegment.map((opt) => (
          <React.Fragment key={opt}>
            {opt === 'matchAll' && <MenuSeparator />}
            <MenuItem
              onClick={() => toggleFilterOption(opt as FilterOptionKey)}
            >
              {filterOptions[opt as FilterOptionKey].label}
              <Toggler
                as='div'
                isOn={filterOptions[opt as FilterOptionKey].enabled}
              />
            </MenuItem>
          </React.Fragment>
        ))}
      </Submenu>
      {/* <MenuLabel>
        Search options:
        <Button
          variant='text'
          icon={<ResetIcon />}
          onClick={restoreDefaultFilterOptions}
          style={{ paddingRight: '4px' }}
          tooltipText='Restore default options'
        />
      </MenuLabel>
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
      ))} */}

      <MenuSeparator />

      <MenuLabel>Filter recipes:</MenuLabel>

      <Submenu caption='Tags'>
        <TagCollection />
      </Submenu>

      {isLoggedIn && (
        <>
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
        </>
      )}

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
