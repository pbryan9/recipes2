import { useState } from 'react';
import { useModal } from '../../lib/context/ModalContextProvider';
import useUser from '../../lib/hooks/useUser';
import { calculateLabelColor } from '../../lib/utils';

import MenuWrapper from './MenuWrapper';
import MenuItem from './MenuItem';
import MenuSeparator from './MenuSeparator';
import LogoutIcon from '../../assets/icons/LogoutIcon';
import ClearIcon from '../../assets/icons/ClearIcon';
import PasswordIcon from '../../assets/icons/PasswordIcon';
import UserIcon from '../../assets/icons/UserIcon';

type UserOptionsMenuProps = {};

export default function UserOptionsMenu({}: UserOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const { logout, avatarColor, username } = useUser();
  const { openModal } = useModal();

  function toggleMenu(e?: MouseEvent) {
    setIsOpen((prev) => !prev);

    if (e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  }

  function clickAvatar() {
    toggleMenu();
    openModal('colorChange');
  }

  function clickPasswordReset() {
    toggleMenu();
    openModal('resetPassword');
  }

  function clickSignOut() {
    toggleMenu();
    logout();
  }

  function clickCancel() {
    toggleMenu();
  }

  const triggerLabel = (
    <div className='flex flex-col items-center gap-2'>
      <UserIcon />
      Account
    </div>
  );

  const badgeColor = avatarColor || '#3A4D00';
  const labelColor = calculateLabelColor(badgeColor);

  return (
    <MenuWrapper {...{ triggerLabel, toggleMenu, isOpen, mousePos }} as='div'>
      <MenuItem as='div' onClick={clickAvatar}>
        <div className='flex gap-3'>
          <div
            className='w-6 aspect-square rounded-full flex items-center justify-center self-center on-primary-container-text title-large'
            style={{
              backgroundColor: badgeColor,
              color: labelColor,
            }}
          >
            <p
              className='cursor-default body-medium'
              style={{
                color: labelColor,
                opacity: 0.75,
              }}
            >
              {username![0].toUpperCase()}
            </p>
          </div>
          Change icon color
        </div>
      </MenuItem>
      <MenuItem as='div' onClick={clickPasswordReset}>
        <div className='flex gap-3'>
          <PasswordIcon />
          Reset password
        </div>
      </MenuItem>
      <MenuItem as='div' onClick={clickSignOut}>
        <div className='flex gap-3'>
          <LogoutIcon />
          Sign out
        </div>
      </MenuItem>
      <MenuSeparator />
      <MenuItem as='div' onClick={clickCancel}>
        <div className='flex gap-3'>
          <ClearIcon />
          Cancel
        </div>
      </MenuItem>
    </MenuWrapper>
  );
}
