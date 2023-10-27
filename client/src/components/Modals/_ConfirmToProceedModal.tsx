import { useModal } from '../../lib/context/ModalContextProvider';
import Button from '../Button';
import Modal from './Modal';

type ConfirmToProceedModalProps = {};

export default function ConfirmToProceedModal({}: ConfirmToProceedModalProps) {
  const { dismissModal } = useModal();
  const modalBody = '';

  const modalButtons = (
    <>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button variant='danger' onClick={() => confirm()}>
        Confirm
      </Button>
    </>
  );

  return (
    <Modal
      headline='Are you sure?'
      caption='This is a template & is meant to be overwritten'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
