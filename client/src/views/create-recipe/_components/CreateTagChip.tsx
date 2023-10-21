import PlusIcon from '../../../assets/icons/PlusIcon';
import { useModal } from '../../../lib/context/ModalContextProvider';

type CreateTagChipProps = {};

export default function CreateTagChip({}: CreateTagChipProps) {
  const { openModal } = useModal();

  return (
    <>
      <button
        className={`label-large shrink-0 rounded-[5px] h-8 flex flex-nowrap items-center gap-2 pl-2 pr-4 border border-primary bg-transparent text-primary`}
        onClick={() => openModal('createTag')}
      >
        <PlusIcon size={18} pathFill='#b5d269' />
        Create new tag
      </button>
    </>
  );
}
