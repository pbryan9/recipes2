import React, { ForwardedRef } from 'react';

type MenuBodyProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

export default React.forwardRef(MenuBody);

function MenuBody(
  { children, isOpen }: MenuBodyProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`bg-surface-container body-large text-on-surface rounded-[4px] grid w-fit min-w-[112px] max-w-[280px] absolute top-1/2 left-1/2 transition-all shadow-lg border border-black/10 ${
        isOpen ? 'grid-rows-[1fr] py-2' : 'grid-rows-[0fr] opacity-0 border-0'
      }`}
    >
      <ul
        className={`h-full w-max min-w-full overflow-hidden flex flex-col gap-0`}
      >
        {children}
      </ul>
    </div>
  );
}
