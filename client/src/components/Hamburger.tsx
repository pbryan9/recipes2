import hamburgerIcon from '../assets/icons/hamburger.svg';

import { useNavigate } from 'react-router-dom';

import useUser from '../lib/hooks/useUser';

export default function Hamburger() {
  const { isLoggedIn, logout, username } = useUser();
  const navigate = useNavigate();

  return <div>hamburger</div>;
}
