import { type FormEvent, type Dispatch, type SetStateAction } from 'react';
import LeftNavCard from './LeftNavCard';

type SearchCardProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function SearchCard({
  searchTerm,
  setSearchTerm,
}: SearchCardProps) {
  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log('searchTerm:', searchTerm);
  }

  return (
    <LeftNavCard>
      <form
        onSubmit={submitHandler}
        className='h-full flex items-center justify-start gap-4'
      >
        <label htmlFor='recipe-search' className=''>
          Search:
        </label>
        <input
          type='text'
          id='recipe-search'
          className='rounded-md text-gray-800 px-4 py-1 w-4/5'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        ></input>
        <button
          disabled={searchTerm === ''}
          type='button'
          onClick={() => setSearchTerm('')}
          className={`${searchTerm === '' ? 'hidden' : ''}`}
        >
          <div className='w-4 aspect-square bg-red-500' />
        </button>
      </form>
    </LeftNavCard>
  );
}
