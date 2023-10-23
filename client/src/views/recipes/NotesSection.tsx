import { useEffect, useState } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import RecipeSectionHeader from './RecipeSectionHeader';

type NotesSectionProps = {
  recipe: FilledRecipe;
};

export default function NotesSection({ recipe }: NotesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  function toggle() {
    setIsExpanded((prev) => !prev);
  }

  useEffect(() => {
    setIsExpanded(true);
  }, [recipe.id]);

  return (
    <section
      className={`h-fit basis-auto relative z-0 overflow-hidden order-1 group-[.expanded]:order-3 group-[.expanded]:basis-[360px] transition-[width]`}
    >
      <RecipeSectionHeader {...{ toggle, isExpanded }} heading='Notes' />

      <div
        className={`grid h-fit transition-all ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`overflow-hidden transition-all h-fit p-6 -top-7 flex flex-col gap-6 rounded-xl rounded-t-none relative z-0 ${
            isExpanded ? 'bg-surface-container pt-14' : 'py-0 bg-transparent'
          }`}
        >
          <ul className='flex flex-col w-full gap-2'>
            {recipe.notes.map((note) => (
              <li key={note.id} className={`body-medium`}>
                {note.description}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
