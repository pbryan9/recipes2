import React from 'react';

type MenuTriggerProps = {
  toggleMenu: () => void;
  children: React.ReactNode;
};

export default function MenuTrigger({
  toggleMenu,
  children,
}: MenuTriggerProps) {
  return (
    <button className='w-full h-14' onClick={toggleMenu}>
      {children}
    </button>
  );
}
