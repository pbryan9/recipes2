import Button from '../Button';
import Modal from './Modal';

type PasswordChangeSuccessModalProps = {
  dismissModal: () => void;
};

export default function PasswordChangeSuccessModal({
  dismissModal,
}: PasswordChangeSuccessModalProps) {
  const modalBody = '';

  const modalButtons = (
    <Button onClick={dismissModal} variant='text'>
      Dismiss
    </Button>
  );

  return (
    <Modal
      headline='Password updated'
      caption='Your password has been successfully reset.'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
