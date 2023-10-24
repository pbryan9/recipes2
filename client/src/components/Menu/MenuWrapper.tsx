import React, { useEffect } from 'react';
import MenuTrigger from './MenuTrigger';
import MenuBody from './MenuBody';
import { useModal } from '../../lib/context/ModalContextProvider';

type MenuWrapperProps = {
  triggerLabel: React.ReactNode;
  toggleMenu: () => void;
  isOpen: boolean;
  children: React.ReactNode;
};

export default function MenuWrapper({
  triggerLabel,
  toggleMenu,
  isOpen,
  children,
}: MenuWrapperProps) {
  const { modalMode } = useModal();

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.code === 'Escape' && !modalMode && isOpen) {
        toggleMenu();
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => window.removeEventListener('keydown', handleEscape);
  }, [modalMode, isOpen]);

  // TODO: figure out click-off

  return (
    <article className='relative w-fit z-0'>
      <MenuTrigger toggleMenu={toggleMenu}>{triggerLabel}</MenuTrigger>
      <MenuBody isOpen={isOpen}>{children}</MenuBody>
    </article>
  );
}
