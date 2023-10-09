'use client';

import Image from 'next/image';
import React, { useState } from 'react';

const variantClasses = {
  none: 'bg-gray-700 text-2xl px-6 font-bold',
  'sub-container': 'bg-gray-300 text-xl pl-8 pr-6 text-gray-800',
} as const;

type LeftNavCardContainerProps = {
  title: string;
  children: React.ReactNode;
  variant?: 'sub-container' | 'none';
};

export default function LeftNavCardContainer({
  title,
  children,
  variant = 'none',
}: LeftNavCardContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article
        onClick={() => setIsOpen((prev) => !prev)}
        className={`category-card h-20 flex-shrink-0 w-full flex items-center justify-between border-b capitalize border-gray-400 cursor-pointer ${variantClasses[variant]}`}
      >
        {title}
        <Image
          className={`origin-center transition-transform duration-100 ${
            isOpen ? '' : '-rotate-90'
          }`}
          alt={`expand "${title}" container`}
          src={'/icons/chevron.svg'}
          width={26}
          height={15}
        />
      </article>
      {isOpen && children}
    </>
  );
}
