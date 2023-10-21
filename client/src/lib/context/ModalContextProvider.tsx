import React, { createContext, useContext, useState } from 'react';
import SignInModal from '../../components/SignInModal';
import SignUpModal from '../../components/SignUpModal';
import AvatarModal from '../../components/AvatarModal';
import NewTagModal from '../../components/NewTagModal';

type ModalName = false | 'signIn' | 'signUp' | 'colorChange' | 'createTag';

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
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
