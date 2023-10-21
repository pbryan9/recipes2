import { useEffect, useState } from 'react';
import { FilledRecipe } from '../../../../api-server/db/recipes/getRecipeById';
import RecipeSectionHeader from './RecipeSectionHeader';

type IngredientsSectionProps = {
  recipe: FilledRecipe;
};

export default function IngredientsSection({
  recipe,
}: IngredientsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  function toggle() {
    setIsExpanded((prev) => !prev);
  }

  useEffect(() => {
    setIsExpanded(true);
  }, [recipe.id]);

  return (
    <section
      className={`h-fit relative z-0 overflow-hidden group-[.expanded]:w-[360px] transition-[width] ease-in-out order-1 group-[.expanded]:order-1 shrink-0`}
    >
      <RecipeSectionHeader {...{ toggle, isExpanded }} heading='Ingredients' />
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
          {recipe.ingredientGroups.map((group) => (
            <div key={group.id} className='h-fit'>
              {group.groupTitle !== '' && (
                <h3 className='title-medium'>
                  {group.groupTitle[0].toUpperCase() +
                    group.groupTitle.slice(1)}
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
      </div>
    </section>
  );
}
