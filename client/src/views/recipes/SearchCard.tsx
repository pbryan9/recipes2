import { useRef, useState } from 'react';
import HamburgerIcon from '../../assets/icons/HamburgerIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import useRecipes from '../../lib/hooks/useRecipesNew';
import ClearIcon from '../../assets/icons/ClearIcon';
import Button from '../create-recipe/_components/Button';

export default function SearchCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { setFilter, filterIsActive, clearFilter } = useRecipes();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFilter(searchTerm);
  }

  function resetFilter() {
    clearFilter();
    setSearchTerm('');
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className='w-full h-14 shrink-0 surface-container-highest on-surface-variant-text rounded-full pl-4 gap-4 flex items-center justify-between body-large relative drop-shadow-level2 cursor-text'
    >
      <div className='flex items-center gap-4'>
        <HamburgerIcon />
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='surface-container-highest placeholder:text-on-surface-variant placeholder:opacity-25 text-on-surface focus-visible:outline-none'
            type='text'
            placeholder='blueberry muffins'
          ></input>
        </form>
      </div>
      {/* <div className=''>{filterIsActive ? <ClearIcon /> : <SearchIcon />}</div> */}
      {filterIsActive ? (
        <Button
          disabled={searchTerm === ''}
          variant='text'
          icon={<ClearIcon />}
          onClick={resetFilter}
        />
      ) : (
        <Button
          variant='text'
          icon={<SearchIcon />}
          onClick={() => setFilter(searchTerm)}
        />
      )}
    </div>
  );
}
