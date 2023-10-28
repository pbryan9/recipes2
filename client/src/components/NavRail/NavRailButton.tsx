import React, { type ComponentProps } from 'react';

type NavRailButtonProps = {
  onClick: () => void;
  icon: React.ReactElement;
  label: string;
};

export default function NavRailButton({
  onClick,
  icon,
  label,
  ...delegated
}: NavRailButtonProps & ComponentProps<'button'>) {
  return (
    <div className='h-14 w-14 flex items-center justify-center label-medium'>
      <button
        {...delegated}
        onClick={onClick}
        className='flex flex-col items-center gap-1 h-12 w-12'
      >
        {icon}
        {label}
      </button>
    </div>
  );
}
