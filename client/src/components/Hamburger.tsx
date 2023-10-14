import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import hamburgerIcon from '../assets/icons/hamburger.svg';

import { useNavigate } from 'react-router-dom';

import useUser from '../lib/hooks/useUser';

export default function Hamburger() {
  const { isLoggedIn, logout, username } = useUser();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='h-8 aspect-square'>
          <img
            src={hamburgerIcon}
            alt='open user menu'
            className='w-full h-full object-cover'
            height='32'
            width='32'
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{username || 'My Account'}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoggedIn ? (
          <DropdownMenuItem onClick={() => logout!()}>
            Sign Out
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => navigate('/sign-in')}>
            Sign In
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
