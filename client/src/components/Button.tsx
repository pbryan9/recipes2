import React, { ComponentProps } from 'react';

const buttonVariants = {
  filled: 'bg-secondary-container text-on-secondary-container',
  outline: 'bg-transparent text-primary border border-outline',
  text: 'bg-transparent text-primary',
  danger: 'text-error border border-error',
};

type ButtonProps = {
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  variant?: keyof typeof buttonVariants;
  children?: React.ReactNode;
  rotate?: boolean;
};

export default function Button({
  type = 'button',
  icon = undefined,
  variant = 'filled',
  rotate = false,
  children,
  ...delegated
}: ComponentProps<'button'> & ButtonProps) {
  return (
    <button
      {...{ ...delegated, type }}
      className={`w-fit basis-auto rounded-full flex items-center gap-2 pr-6 h-10 label-large print:hidden ${
        icon && children ? 'pl-4' : 'pl-6'
      }
        ${buttonVariants[variant]}
        ${rotate ? 'rotate-90' : ''}
      `}
    >
      {icon}
      {children}
    </button>
  );
}
