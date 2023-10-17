import React, { ComponentProps } from 'react';

type ButtonProps = {
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export default function Button({
  type = 'button',
  icon = undefined,
  children,
  ...delegated
}: ComponentProps<'button'> & ButtonProps) {
  return (
    <button
      {...{ ...delegated, type }}
      className={`w-fit rounded-full flex items-center gap-2 pr-6 h-10 label-large bg-secondary-container text-on-secondary-container ${
        icon ? 'pl-4' : 'pl-6'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}
