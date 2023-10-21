import { useContext } from 'react';
import { TagContext } from '../context/TagsContextProvider';

export default function useTags() {
  return useContext(TagContext);
}
