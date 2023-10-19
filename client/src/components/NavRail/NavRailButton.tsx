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
    <div className='h-14 aspect-square flex items-center justify-center label-medium'>
      <button
        {...delegated}
        onClick={onClick}
        className='flex flex-col items-center gap-1 h-12 aspect-square'
      >
        {icon}
        {label}
      </button>
    </div>
  );
}
