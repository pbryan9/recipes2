import React, { createContext, useContext, useEffect, useState } from 'react';
import SignInModal from '../../components/Modals/SignInModal';
import SignUpModal from '../../components/Modals/SignUpModal';
import AvatarModal from '../../components/Modals/AvatarModal';
import NewTagModal from '../../components/Modals/NewTagModal';
import NewNoteModal from '../../components/Modals/NewNoteModal';
import PasswordResetModal from '../../components/Modals/PasswordResetModal';

type ModalName =
  | false
  | 'signIn'
  | 'signUp'
  | 'colorChange'
  | 'createTag'
  | 'createNote'
  | 'forgotPassword'
  | 'resetPassword';

export type ModalContext = {
  modalMode: ModalName;
  openModal: (modalName: Exclude<ModalName, false>) => void;
  dismissModal: () => void;
};

const ModalContext = createContext<ModalContext>({
  modalMode: false,
  dismissModal: () => null,
  openModal: () => null,
});

export default function ModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modalMode, setModalMode] = useState<ModalName>(false);

  useEffect(() => {
    function handleEscKey(e: KeyboardEvent) {
      if (modalMode && e.code === 'Escape') {
        dismissModal();
      }
    }

    window.addEventListener('keydown', handleEscKey);

    return () => window.removeEventListener('keydown', handleEscKey);
  }, [modalMode]);

  function dismissModal() {
    setModalMode(false);
  }

  function openModal(modalName: Exclude<ModalName, false>) {
    setModalMode(modalName);
  }

  return (
    <ModalContext.Provider value={{ modalMode, dismissModal, openModal }}>
      {modalMode === 'signIn' && <SignInModal dismissModal={dismissModal} />}
      {modalMode === 'signUp' && <SignUpModal dismissModal={dismissModal} />}
      {modalMode === 'colorChange' && (
        <AvatarModal dismissModal={dismissModal} />
      )}
      {modalMode === 'createTag' && <NewTagModal dismissModal={dismissModal} />}
      {modalMode === 'createNote' && (
        <NewNoteModal dismissModal={dismissModal} />
      )}
      {modalMode === 'forgotPassword' && (
        <PasswordResetModal dismissModal={dismissModal} />
      )}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
