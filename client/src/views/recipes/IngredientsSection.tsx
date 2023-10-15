import { useEffect, useState, useRef } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import RecipeSectionHeader from './RecipeSectionHeader';

import { gsap } from 'gsap';

type IngredientsSectionProps = {
  recipe: FilledRecipe;
};

export default function IngredientsSection({
  recipe,
}: IngredientsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [prevExpanded, setPrevExpanded] = useState(true);

  function toggle() {
    setIsExpanded((prev) => !prev);
  }

  useEffect(() => {
    setIsExpanded(true);
  }, [recipe.id]);

  return (
    <section
      className={`w-full h-fit relative z-0 shrink-0 overflow-hidden ${
        isExpanded ? 'group expanded' : ''
      }`}
    >
      <RecipeSectionHeader {...{ toggle, isExpanded }} heading='Ingredients' />

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out group-[.expanded]:max-h-[3000px] -top-7 max-h-0 px-6 py-0 bg-surface-container flex flex-col gap-6 group-[.expanded]:pt-11 group-[.expanded]:pb-6 rounded-xl rounded-t-none relative z-0`}
      >
        {recipe.ingredientGroups.map((group) => (
          <div key={group.id} className='h-fit'>
            {group.groupTitle !== '' && (
              <h3 className='title-medium'>
                {group.groupTitle[0].toUpperCase() + group.groupTitle.slice(1)}
              </h3>
            )}

            <ul className='flex flex-col w-full gap-2'>
              {group.ingredients.map((ingredient) => (
                <li
                  key={ingredient.id}
                  className={`${
                    group.groupTitle !== '' ? 'pl-4' : ''
                  } body-medium`}
                >
                  {ingredient.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
