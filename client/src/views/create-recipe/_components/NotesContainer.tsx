import { useState, type SetStateAction, useEffect } from 'react';
import MinusIcon from '../../../assets/icons/MinusIcon';
import PlusIcon from '../../../assets/icons/PlusIcon';
import { useModal } from '../../../lib/context/ModalContextProvider';
import Button from '../../../components/Button';
import NewIcon from '../../../assets/icons/NewIcon';
import { NewNote } from '../CreateRecipeView';
import TrashIcon from '../../../assets/icons/TrashIcon';
import React from 'react';

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

  function removeNote(noteId: string) {
    setNotes((prev) => [...prev.filter((note) => note.tempId !== noteId)]);
  }

  return (
    <article className='flex flex-col items-center w-full z-0'>
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
        className={`w-full relative z-0 shadow-sm rounded-[12px] transition-all duration-500 p-4 pt-12 bg-surface-container-low grid ${
          isExpanded
            ? 'grid-rows-[1fr] -top-7 basis-auto'
            : 'grid-rows-[0fr] bg-transparent -top-14 py-0'
        }`}
      >
        <ul
          className={`flex flex-col justify-start items-start h-full overflow-hidden`}
        >
          {!notes.length && <p>No notes yet. Click below to add one!</p>}
          {notes?.map((note) => (
            <li
              className='flex gap-2 items-center justify-start p-0'
              key={note.tempId}
            >
              <Button
                variant='text'
                style={{ alignSelf: 'flex-start' }}
                icon={<TrashIcon />}
                onClick={() => removeNote(note.tempId)}
              />
              <p className=''>{note.description}</p>
            </li>
          ))}
          <li className='flex gap-2 items-center justify-start p-0 pt-6'>
            <Button onClick={() => openModal('createNote')} icon={<NewIcon />}>
              New note
            </Button>
          </li>
        </ul>
      </section>
    </article>
  );
}
