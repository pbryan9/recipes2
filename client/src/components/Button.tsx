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
  tooltipText?: string;
};

export default function Button({
  type = 'button',
  icon = undefined,
  variant = 'filled',
  rotate = false,
  tooltipText = undefined,
  children,
  ...delegated
}: ComponentProps<'button'> & ButtonProps) {
  return (
    <button
      {...{ ...delegated, type }}
      className={`w-fit relative basis-auto rounded-full flex items-center gap-2 pr-6 h-10 label-large z-0 group hover:delay-200 print:hidden ${
        icon && children ? 'pl-4' : 'pl-6'
      }
        ${buttonVariants[variant]}
        ${rotate ? 'rotate-90' : ''}
      `}
    >
      {/* {tooltipText && (
        // TODO: tooltip is very much a rough draft -- needs lots of work
        <span className='hidden absolute group-hover:inline transition-all delay-200 bg-surface-container-highest w-fit top-0 right-1/2 -translate-y-full translate-x-1/2 z-20 border border-outline py-2 px-4 rounded-[3px]'>
          {tooltipText}
        </span>
      )} */}
      {icon}
      {children}
    </button>
  );
}
