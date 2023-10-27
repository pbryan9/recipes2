import { useEffect } from 'react';
import { useModal } from '../../lib/context/ModalContextProvider';
import Button from '../Button';
import Modal from './Modal';
import { useSearchParams } from 'react-router-dom';

type ConfirmToResetFormModalProps = {};

export default function ConfirmToResetFormModal({}: ConfirmToResetFormModalProps) {
  const [searchParams] = useSearchParams();
  const { dismissModal } = useModal();

  const recipeId = searchParams.get('recipeId');

  const conditionalCaption = recipeId
    ? `Click 'Confirm' to reset the form to its last-saved status. It won't be completely cleared, but you'll lose any edits made since the last time it was saved. This action cannot be reversed.`
    : `Click 'Confirm' to clear the form back to its starting position. This action cannot be reversed.`;

  // useEffect(() => {
  //   // make sure the cancel event fires when we use the esc shortcut to close modal
  //   // so that any subscribers can clean up their own listeners
  //   return cancelEvent;
  // }, []);

  function confirm() {
    console.log('confirming');
    const evt = new CustomEvent('reset_confirmed');

    window.dispatchEvent(evt);

    dismissModal();
  }

  function cancel() {
    console.log('cancelling');
    cancelEvent();
    dismissModal();
  }

  function cancelEvent() {
    const evt = new CustomEvent('reset_cancelled');

    window.dispatchEvent(evt);
  }

  const modalBody = '';

  const modalButtons = (
    <>
      <Button onClick={cancel} variant='text'>
        Cancel
      </Button>
      <Button variant='danger' onClick={confirm}>
        Confirm
      </Button>
    </>
  );

  return (
    <Modal
      headline='Reset form'
      caption={conditionalCaption}
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
