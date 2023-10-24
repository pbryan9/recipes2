import { useContext } from 'react';
import { FilterContext } from '../context/FilterContextProvider';

export default function useFilter() {
  const ctx = useContext(FilterContext);

  return { ...ctx };
}
