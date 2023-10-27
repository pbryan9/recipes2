import { useEffect } from 'react';
import { useModal } from '../../lib/context/ModalContextProvider';
import Button from '../Button';
import Modal from './Modal';

type ConfirmToDeleteItemModalProps = {};

export default function ConfirmToDeleteItemModal({}: ConfirmToDeleteItemModalProps) {
  const { dismissModal } = useModal();

  function confirm() {
    const evt = new CustomEvent('delete_confirmed');

    window.dispatchEvent(evt);

    dismissModal();
  }

  function cancel() {
    cancelEvent();
    dismissModal();
  }

  function cancelEvent() {
    const evt = new CustomEvent('delete_cancelled');

    window.dispatchEvent(evt);
  }

  const modalBody = '';

  const modalButtons = (
    <>
      <Button onClick={cancel} variant='text'>
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
      caption={`Click 'Confirm' to delete this item. This action cannot be reversed.`}
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
