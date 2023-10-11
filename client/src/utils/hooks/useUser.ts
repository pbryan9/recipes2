import { useContext } from 'react';
import { UserContext } from '../context/UserContextProvider';

export default function useUser() {
  const userCtx = useContext(UserContext);

  return { ...userCtx };
}
