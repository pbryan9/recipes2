import React from 'react';

type MenuBodyProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export default function MenuBody({ children, isOpen }: MenuBodyProps) {
  return (
    <div
      className={`bg-surface-container text-on-surface rounded-[4px] grid w-fit min-w-[112px] max-w-[280px] absolute top-1/2 left-1/2 transition-all shadow-lg border border-black/10 ${
        isOpen ? 'grid-rows-[1fr] py-2' : 'grid-rows-[0fr] opacity-0'
      }`}
    >
      <ul className={`h-full w-fit overflow-hidden flex flex-col gap-0`}>
        {children}
      </ul>
    </div>
  );
}