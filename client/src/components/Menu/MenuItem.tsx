import React from 'react';

type MenuItemProps = {
  children: React.ReactNode;
  onClick: () => void;

  icon?: React.ReactNode;
  closeOnClick?: boolean;
};

export default function MenuItem({ children, onClick }: MenuItemProps) {
  return (
    <li className='h-12 hover:bg-white/10 w-full'>
      <button
        className='h-full w-full px-3 flex justify-between items-center gap-3 whitespace-nowrap'
        onClick={onClick}
      >
        {children}
      </button>
    </li>
  );
}
