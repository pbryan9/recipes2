import React from 'react';

type LeftNavProps = {
  children: React.ReactNode;
};

export default function LeftNav({ children }: LeftNavProps) {
  return (
    <nav className='h-full basis-4/12 bg-slate-400 overflow-y-auto flex flex-col justify-start gap-0 border-r border-gray-400'>
      {children}
    </nav>
  );
}
