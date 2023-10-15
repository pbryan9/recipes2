import { useRef, useState } from 'react';
import HamburgerIcon from '../../assets/icons/HamburgerIcon';
import SearchIcon from '../../assets/icons/SearchIcon';
import useRecipes from '../../lib/hooks/useRecipesNew';

export default function SearchCard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { setFilter } = useRecipes();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFilter(searchTerm);
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className='w-full h-14 shrink-0 surface-container-highest on-surface-variant-text rounded-full px-4 gap-4 flex items-center justify-between body-large relative drop-shadow-level2'
    >
      <div className='flex items-center gap-4'>
        <HamburgerIcon />
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='surface-container-highest'
            type='text'
            placeholder='blueberry muffins'
          ></input>
        </form>
      </div>
      <div className=''>
        <SearchIcon />
      </div>
    </div>
  );
}
