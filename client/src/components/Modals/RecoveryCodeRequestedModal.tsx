import { useModal } from '../../lib/context/ModalContextProvider';
import Button from '../Button';
import Modal from './Modal';

type RecoveryCodeRequestedModalProps = {};

export default function RecoveryCodeRequestedModal({}: RecoveryCodeRequestedModalProps) {
  const { dismissModal } = useModal();

  const modalButtons = (
    <Button onClick={dismissModal} variant='text'>
      Dismiss
    </Button>
  );

  return (
    <Modal
      headline='Check your email'
      // caption='.'
      body={`Your request for password recovery has been received. Within the next few minutes, you should receive an email containing instructions to complete your password recovery.`}
      buttons={modalButtons}
    />
  );
}
