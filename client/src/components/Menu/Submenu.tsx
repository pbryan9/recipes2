import React, { useEffect, useRef, useState } from 'react';
import ChevronIcon from '../../assets/icons/ChevronIcon';

type SubmenuProps = {
  children: React.ReactNode;
  caption?: string;
  icon?: React.ReactNode;
};

export default function Submenu({ children, caption = 'hello' }: SubmenuProps) {
  const [submenuIsOpen, setSubmenuIsOpen] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    function showMenu() {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => setSubmenuIsOpen(true), 250);
    }

    function hideMenu() {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => setSubmenuIsOpen(false), 300);
    }

    if (submenuRef.current !== null) {
      submenuRef.current.addEventListener('mouseenter', showMenu);
      submenuRef.current.addEventListener('mouseleave', hideMenu);
    }

    return () => {
      submenuRef.current?.removeEventListener('mouseenter', showMenu);
      submenuRef.current?.removeEventListener('mouseleave', hideMenu);
    };
  }, [submenuIsOpen]);

  return (
    <li className='h-12 hover:bg-white/10 w-full cursor-pointer relative z-10'>
      <div
        ref={submenuRef}
        className='h-full w-full px-3 flex justify-between items-center gap-3 whitespace-nowrap'
      >
        {caption}
        <ChevronIcon />
        <ul
          className={`absolute top-0 right-0 translate-x-full max-w-[360px] w-fit bg-surface-container-high rounded-[4px] py-2 ${
            submenuIsOpen ? '' : 'hidden'
          }`}
        >
          {children}
        </ul>
      </div>
    </li>
  );
}
