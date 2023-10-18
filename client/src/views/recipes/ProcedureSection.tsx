import { useEffect, useState } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import RecipeSectionHeader from './RecipeSectionHeader';

type ProcedureSectionProps = {
  recipe: FilledRecipe;
};

export default function ProcedureSection({ recipe }: ProcedureSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  function toggle() {
    setIsExpanded((prev) => !prev);
  }

  useEffect(() => {
    setIsExpanded(true);
  }, [recipe.id]);

  return (
    <section
      className={`w-full h-fit relative z-0 overflow-hidden transition-all`}
    >
      <RecipeSectionHeader {...{ toggle, isExpanded }} heading='Procedure' />

      <div
        className={`grid w-full h-fit transition-all ${
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`overflow-hidden transition-all h-fit p-6 -top-7 flex flex-col gap-6 rounded-xl rounded-t-none relative z-0 ${
            isExpanded ? 'bg-surface-container pt-14' : 'py-0 bg-transparent'
          }`}
        >
          {recipe.procedureGroups.map((group) => (
            <div key={group.id} className='h-fit'>
              {group.groupTitle !== '' && (
                <h3 className='title-medium'>
                  {group.groupTitle[0].toUpperCase() +
                    group.groupTitle.slice(1)}
                </h3>
              )}

              <ul className='flex flex-col w-full gap-2'>
                {group.procedureSteps.map((step) => (
                  <li
                    key={step.id}
                    className={`${
                      group.groupTitle !== '' ? 'pl-4' : ''
                    } body-medium`}
                  >
                    {step.description}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
