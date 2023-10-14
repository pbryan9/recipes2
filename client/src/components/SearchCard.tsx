import { type FormEvent, useContext } from 'react';
import { RecipesContext } from '../lib/context/RecipesContextProvider';
import LeftNavCard from './LeftNavCard';

export default function SearchCard() {
  const { dispatch, searchTerm } = useContext(RecipesContext);

  function submitHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  if (!dispatch) return <h1>Waiting for dispatch</h1>;

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
          onChange={(e) =>
            dispatch({
              type: 'set_filter',
              payload: { searchTerm: e.target.value || '' },
            })
          }
        ></input>
        <button
          disabled={searchTerm === ''}
          type='button'
          onClick={() =>
            dispatch({
              type: 'clear_filter',
            })
          }
          className={`${searchTerm === '' ? 'hidden' : ''}`}
        >
          <div className='w-4 aspect-square bg-red-500' />
        </button>
      </form>
    </LeftNavCard>
  );
}
