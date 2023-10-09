import { ReactNode } from 'react';

export default function StandardMainContainer({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className='basis-8/12 h-full border border-gray-400 p-6 overflow-y-auto'>
      {children}
    </main>
  );
}
