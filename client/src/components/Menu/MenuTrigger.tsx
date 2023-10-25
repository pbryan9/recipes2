import React from 'react';

type MenuTriggerProps = {
  toggleMenu: () => void;
  children: React.ReactNode;
  as?: 'button' | 'div';
};

export default function MenuTrigger({
  toggleMenu,
  children,
  as = 'button',
}: MenuTriggerProps) {
  const PolyTag = as;

  return (
    <PolyTag className='w-full' onClick={toggleMenu}>
      {children}
    </PolyTag>
  );
}
