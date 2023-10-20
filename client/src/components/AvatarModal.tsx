import { useState } from 'react';
import useUser from '../lib/hooks/useUser';
import Modal from './Modal';
import Button from './Button';
import CheckIcon from '../assets/icons/CheckIcon';

type AvatarModalProps = {
  dismissModal: () => void;
};

export default function AvatarModal({ dismissModal }: AvatarModalProps) {
  const { avatarColor, changeAvatarColor } = useUser();
  const [selectedColor, setSelectedColor] = useState(avatarColor);

  function handleSubmit() {
    changeAvatarColor(selectedColor);
    dismissModal();
  }

  const colorChangeBody = (
    <input
      className='rounded-full'
      type='color'
      value={selectedColor}
      onChange={(e) => setSelectedColor(e.target.value)}
    />
  );

  const colorChangeButtons = (
    <>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button variant='filled' onClick={handleSubmit} icon={<CheckIcon />}>
        Update color
      </Button>
    </>
  );

  return (
    <Modal
      headline='Change avatar color'
      body={colorChangeBody}
      buttons={colorChangeButtons}
    />
  );
}
