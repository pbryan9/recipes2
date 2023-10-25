import { useState } from 'react';
import SettingsIcon from '../../assets/icons/SettingsIcon';
import MenuWrapper from './MenuWrapper';
import MenuItem from './MenuItem';
import { useModal } from '../../lib/context/ModalContextProvider';
import MenuSeparator from './MenuSeparator';
import useUser from '../../lib/hooks/useUser';
import { calculateLabelColor } from '../../lib/utils';
import LogoutIcon from '../../assets/icons/LogoutIcon';
import ClearIcon from '../../assets/icons/ClearIcon';

type UserOptionsMenuProps = {};

export default function UserOptionsMenu({}: UserOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, avatarColor, username } = useUser();
  const { openModal } = useModal();

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  function clickAvatar() {
    toggleMenu();
    openModal('colorChange');
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
      <SettingsIcon />
      Account
    </div>
  );

  const badgeColor = avatarColor || '#3A4D00';
  const labelColor = calculateLabelColor(badgeColor);

  return (
    <MenuWrapper {...{ triggerLabel, toggleMenu, isOpen }} as='div'>
      <MenuItem as='div' onClick={clickAvatar}>
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
        Avatar color
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
