import React from 'react';

type MenuItemProps = {
  children: React.ReactNode;
  onClick: () => void;

  icon?: React.ReactNode;
  as?: 'button' | 'div';
  closeOnClick?: boolean;
};

export default function MenuItem({
  children,
  onClick,
  as = 'button',
}: MenuItemProps) {
  const PolyTag = as;

  return (
    <li className='h-12 hover:bg-white/10 w-full cursor-pointer'>
      <PolyTag
        className='h-full w-full px-3 flex justify-between items-center gap-3 whitespace-nowrap'
        onClick={onClick}
      >
        {children}
      </PolyTag>
    </li>
  );
}
