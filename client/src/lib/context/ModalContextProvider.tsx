import React, { createContext, useContext, useEffect, useState } from 'react';
import SignInModal from '../../components/Modals/SignInModal';
import SignUpModal from '../../components/Modals/SignUpModal';
import AvatarModal from '../../components/Modals/AvatarModal';
import NewTagModal from '../../components/Modals/NewTagModal';
import NewNoteModal from '../../components/Modals/NewNoteModal';
import ForgotPasswordModal from '../../components/Modals/ForgotPasswordModal';
import UpdatePasswordModal from '../../components/Modals/UpdatePasswordModal';
import PasswordChangeSuccessModal from '../../components/Modals/PasswordChangeSuccessModal';
import RecoveryCodeRequestedModal from '../../components/Modals/RecoveryCodeRequestedModal';
import ConfirmToDeleteItemModal from '../../components/Modals/ConfirmToDeleteItem';
import ConfirmToResetFormModal from '../../components/Modals/ConfirmToResetForm';
import ShareRecipeModal from '../../components/Modals/ShareRecipeModal';

type ModalName =
  | false
  | 'signIn'
  | 'signUp'
  | 'colorChange'
  | 'createTag'
  | 'createNote'
  | 'forgotPassword'
  | 'resetPassword'
  | 'passwordChangeSuccess'
  | 'recoveryCodeRequested'
  | 'confirmToDeleteItem'
  | 'confirmToResetForm'
  | 'shareRecipe';

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
        window.dispatchEvent(new CustomEvent('reset_cancelled'));
        window.dispatchEvent(new CustomEvent('delete_cancelled'));
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
      {modalMode === 'forgotPassword' && <ForgotPasswordModal />}
      {modalMode === 'resetPassword' && <UpdatePasswordModal />}
      {modalMode === 'passwordChangeSuccess' && (
        <PasswordChangeSuccessModal dismissModal={dismissModal} />
      )}
      {modalMode === 'recoveryCodeRequested' && <RecoveryCodeRequestedModal />}
      {modalMode === 'confirmToDeleteItem' && <ConfirmToDeleteItemModal />}
      {modalMode === 'confirmToResetForm' && <ConfirmToResetFormModal />}
      {modalMode === 'shareRecipe' && <ShareRecipeModal />}
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
