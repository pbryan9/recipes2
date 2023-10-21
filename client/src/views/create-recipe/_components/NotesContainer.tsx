import { useState, type SetStateAction, useEffect } from 'react';
import MinusIcon from '../../../assets/icons/MinusIcon';
import PlusIcon from '../../../assets/icons/PlusIcon';
import { useModal } from '../../../lib/context/ModalContextProvider';
import Button from '../../../components/Button';
import NewIcon from '../../../assets/icons/NewIcon';
import { NewNote } from '../CreateRecipeView';

declare global {
  interface WindowEventMap {
    noteAdded: CustomEvent<NewNote>;
  }
}

type NotesContainerProps = {
  notes: NewNote[];
  setNotes: React.Dispatch<SetStateAction<NewNote[]>>;
};

export default function NotesContainer({
  notes,
  setNotes,
}: NotesContainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    function addNote(e: CustomEvent<NewNote>) {
      setNotes((prev) => [...prev, e.detail]);
    }

    window.addEventListener('noteAdded', addNote);

    return () => window.removeEventListener('noteAdded', addNote);
  }, []);

  return (
    <article className='flex flex-col items-center w-full h-full'>
      <button
        className='z-10 w-full'
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <header className='title-large h-14 w-full px-4 flex items-center gap-4 bg-surface-container-high rounded-full shadow-md'>
          {isExpanded ? <MinusIcon /> : <PlusIcon />}
          Notes
        </header>
      </button>
      <section
        className={`w-full relative -top-7 z-0 shadow-sm rounded-[12px] transition-all duration-500 p-4 pt-0 bg-surface-container-low overflow-hidden grid ${
          isExpanded
            ? 'grid-rows-[1fr]'
            : 'grid-rows-[0fr] -top-14 bg-transparent'
        }`}
      >
        <div
          className={`flex flex-wrap items-start justify-start w-full gap-2 p-6 pt-14 overflow-hidden transition-all duration-200 ${
            isExpanded ? '' : 'py-0'
          }`}
        >
          {!notes.length && <p>No notes yet. Click below to add one!</p>}
          {notes.map((note) => (
            <p className='w-full' key={note.tempId}>
              {note.description}
            </p>
          ))}
        </div>
        {isExpanded && (
          <Button onClick={() => openModal('createNote')} icon={<NewIcon />}>
            New note
          </Button>
        )}
      </section>
    </article>
  );
}
