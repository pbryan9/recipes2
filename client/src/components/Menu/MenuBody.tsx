import React, { ForwardedRef } from 'react';

type Position = { x: number; y: number };

type MenuBodyProps = {
  children: React.ReactNode;
  isOpen: boolean;
  mousePos?: Position;
};

export default React.forwardRef(MenuBody);

function MenuBody(
  { children, isOpen, mousePos }: MenuBodyProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      ref={ref}
      className={`relative z-0 bg-surface-container body-large text-on-surface rounded-[4px] grid w-fit min-w-[112px] max-w-[280px] transition-all shadow-lg border border-black/10 ${
        isOpen ? 'grid-rows-[1fr] py-2' : 'grid-rows-[0fr] opacity-0 border-0'
      }
      ${mousePos ? 'fixed' : 'absolute top-1/2 left-1/2'}
      `}
      style={
        mousePos
          ? {
              position: 'fixed',
              top: mousePos.y + 'px',
              left: mousePos.x + 'px',
            }
          : undefined
      }
    >
      <ul
        className={`h-full w-max min-w-full flex flex-col gap-0 ${
          isOpen ? 'overflow-visible' : 'overflow-hidden' // must allow overflow for submenu to be visible
        }`}
      >
        {children}
      </ul>
    </div>
  );
}
