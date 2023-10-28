import React, { useEffect, useRef } from 'react';
import MenuTrigger from './MenuTrigger';
import MenuBody from './MenuBody';
import { useModal } from '../../lib/context/ModalContextProvider';

type MenuWrapperProps = {
  triggerLabel: React.ReactNode;
  toggleMenu: () => void;
  isOpen: boolean;
  children: React.ReactNode;
  as?: 'button' | 'div';
  mousePos?: { x: number; y: number };
};

export default function MenuWrapper({
  triggerLabel,
  toggleMenu,
  isOpen,
  children,
  as = 'button',
  mousePos,
}: MenuWrapperProps) {
  const { modalMode } = useModal();
  const menuBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.code === 'Escape' && !modalMode && isOpen) {
        toggleMenu();
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalMode, isOpen]);

  useEffect(() => {
    // set up "click off" function

    if (isOpen) {
      // have to delay the measurement due to animation
      // that makes removing the event listener tricky, hence the abort controller
      let abortController = new AbortController();

      setTimeout(() => {
        let boxMeasurement = menuBodyRef.current?.getBoundingClientRect();

        function clickOff(e: MouseEvent) {
          if (!boxMeasurement) return;

          let [x, y] = [e.clientX, e.clientY];
          let { left, right, top, bottom } = boxMeasurement;

          const clickIsInsideMenu =
            x > left && x < right && y > top && y < bottom;

          if (!clickIsInsideMenu) {
            toggleMenu();
          }
        }

        document.addEventListener('click', clickOff, {
          signal: abortController.signal,
        });
      }, 500);

      return () => abortController.abort();
    }
  }, [isOpen]);

  if (modalMode !== false && isOpen) toggleMenu();

  return (
    <article className='relative w-fit z-10'>
      <MenuTrigger toggleMenu={toggleMenu} as={as}>
        {triggerLabel}
      </MenuTrigger>
      <MenuBody ref={menuBodyRef} isOpen={isOpen} mousePos={mousePos}>
        {children}
      </MenuBody>
    </article>
  );
}
