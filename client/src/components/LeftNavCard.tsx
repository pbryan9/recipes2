import React from 'react';

const variantClasses = {
  none: 'bg-gray-700 text-2xl px-6 font-bold',
  'sub-item': 'bg-gray-300 text-xl pl-8 pr-6 text-gray-800',
  'sub-sub-item': 'bg-gray-200 text-lg pl-10 pr-6 text-gray-700',
} as const;

type LeftNavCardProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  variant?: keyof typeof variantClasses;
  selected?: boolean;
};

export default function LeftNavCard({
  children,
  onClick,
  variant = 'none',
  selected = undefined,
}: LeftNavCardProps) {
  return (
    <article
      onClick={onClick}
      className={`category-card h-20 flex-shrink-0 w-full capitalize flex items-center border-b border-gray-400 ${
        onClick ? 'cursor-pointer' : ''
      } ${variantClasses[variant || 'none']}`}
      style={selected ? styles.selected : undefined}
    >
      {children}
    </article>
  );
}

const styles = {
  selected: {
    backgroundColor: 'rgb(134, 239, 172)',
  },
};
