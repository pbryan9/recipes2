import { useState } from 'react';
import useUser from '../../lib/hooks/useUser';
import Modal from './Modal';
import Button from '../Button';
import CheckIcon from '../../assets/icons/CheckIcon';
import { calculateLabelColor } from '../../lib/utils';

type AvatarModalProps = {
  dismissModal: () => void;
};

export default function AvatarModal({ dismissModal }: AvatarModalProps) {
  const { avatarColor, changeAvatarColor, username } = useUser();
  const [selectedColor, setSelectedColor] = useState(avatarColor);

  function handleSubmit() {
    changeAvatarColor(selectedColor);
    dismissModal();
  }

  const colorChangeBody = (
    <div
      className='relative w-16 aspect-square rounded-full flex items-center justify-center self-center on-primary-container-text title-large shrink-0 z-0'
      style={{
        backgroundColor: selectedColor || '#3A4D00',
        color: calculateLabelColor(selectedColor),
      }}
    >
      <input
        className='absolute left-0 top-0 opacity-0 z-10 w-full h-full'
        type='color'
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      />
      <p
        className='cursor-default display-small'
        style={{ color: calculateLabelColor(selectedColor), opacity: 0.75 }}
      >
        {username![0].toUpperCase()}
      </p>
    </div>
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
