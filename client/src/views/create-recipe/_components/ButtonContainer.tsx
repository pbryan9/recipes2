import type { PropsWithChildren } from 'react';

export default function ButtonContainer({ children }: PropsWithChildren) {
  return (
    <section className='col-span-8 grid grid-cols-8 w-full h-full gap-4'>
      {children}
    </section>
  );
}
