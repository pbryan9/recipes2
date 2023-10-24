import React, { useState } from 'react';
import MenuItem from './MenuItem';
import MenuWrapper from './MenuWrapper';

type MenuProps = {
  label: React.ReactNode;
};

export default function Menu({ label }: MenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleMenu() {
    setIsOpen((prev) => !prev);
  }

  return (
    <MenuWrapper triggerLabel={label} toggleMenu={toggleMenu} isOpen={isOpen}>
      <MenuItem onClick={() => console.log('menu item 1 clicked')}>
        Menu Item 1
      </MenuItem>
      <MenuItem onClick={() => console.log('menu item 2 clicked')}>
        Menu Item 2
      </MenuItem>
      <MenuItem
        onClick={() => {
          console.log('menu item 3 clicked');
          toggleMenu();
        }}
      >
        Menu Item 3
      </MenuItem>
    </MenuWrapper>
  );
}
