import React from 'react';

type MenuLabelProps = {
  children: React.ReactNode;
};

export default function MenuLabel({ children }: MenuLabelProps) {
  return (
    <li className='h-12 w-full cursor-default'>
      <div className='h-full w-full px-3 flex justify-between items-center gap-3 whitespace-nowrap'>
        {children}
      </div>
    </li>
  );
}
