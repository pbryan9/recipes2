import React from 'react';

type LayoutContainerProps = {
  children: React.ReactNode;
};

export default function LayoutContainer({ children }: LayoutContainerProps) {
  return (
    <section className='flex justify-between items-start h-[calc(100vh_-_80px_-_128px)] overflow-y-hidden w-full'>
      {children}
    </section>
  );
}
