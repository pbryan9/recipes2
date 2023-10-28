import { useRef } from 'react';

import HamburgerIcon from '../../assets/icons/HamburgerIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import ClearIcon from '../../assets/icons/ClearIcon';
import Button from '../../components/Button';
import SearchOptionsMenu from '../../components/Menu/SearchOptionsMenu';
import useFilter from '../../lib/hooks/useFilter';

export default function SearchCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchTerm, updateFilter, clearFilter } = useFilter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateFilter(searchTerm);
  }

  const filterIsActive = searchTerm !== '';

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className='w-full h-14 shrink-0 surface-container-highest on-surface-variant-text rounded-full pl-4 gap-4 flex items-center justify-between body-large relative drop-shadow-level2 cursor-text'
    >
      <div className='flex items-center gap-4'>
        {/* <HamburgerIcon /> */}
        <SearchOptionsMenu
          label={
            <div className='h-full aspect-square flex items-center'>
              <HamburgerIcon />
            </div>
          }
          resetFilter={clearFilter}
        />
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => updateFilter(e.target.value)}
            className='surface-container-highest placeholder:text-on-surface-variant placeholder:opacity-25 text-on-surface focus-visible:outline-none'
            type='text'
            placeholder='blueberry muffins'
          ></input>
        </form>
      </div>
      {/* <div className=''>{filterIsActive ? <ClearIcon /> : <SearchIcon />}</div> */}
      {filterIsActive ? (
        <Button variant='text' icon={<ClearIcon />} onClick={clearFilter} />
      ) : (
        <Button
          disabled={searchTerm === ''}
          variant='text'
          icon={<SearchIcon />}
          onClick={() => updateFilter(searchTerm)}
        />
      )}
    </div>
  );
}
