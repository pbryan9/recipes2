import type { UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import Button from './Button';
import {
  FormInputs,
  uomValues,
} from '../../../../../api-server/validators/newRecipeFormValidator';
import { RouterInputs } from '../../../utils/trpc/trpc';

type IngredientItemProps = {
  ingredientIndex: number;
  groupIndex: number;
  register: UseFormRegister<RouterInputs['recipes']['create']>;
  removeMember: UseFieldArrayRemove;
};

export default function IngredientItem({
  ingredientIndex,
  groupIndex,
  register,
  removeMember,
}: IngredientItemProps) {
  const registrationPath = `ingredientGroups.${groupIndex}.ingredients.${ingredientIndex}`;

  return (
    <div className='ingredient-group grid grid-cols-8 col-span-full h-full'>
      <input
        {...register(
          `${registrationPath}.qty` as 'ingredientGroups.0.ingredients.0.qty'
        )}
        type='number'
        className='col-span-1 rounded-l-md border-r border-gray-400 text-gray-900 text-center h-full'
      />
      <select
        {...register(
          `${registrationPath}.uom` as 'ingredientGroups.0.ingredients.0.uom'
        )}
        className='col-span-1 border-r border-gray-400 text-gray-900 text-center h-full'
      >
        {[...uomValues]
          .sort((a, b) => (a > b ? 1 : -1))
          .map((uom) => (
            <option key={uom} value={uom}>
              {uom.toLowerCase()}
            </option>
          ))}
      </select>
      <input
        {...register(
          `${registrationPath}.description` as 'ingredientGroups.0.ingredients.0.description'
        )}
        type='text'
        className='col-span-5 rounded-r-md text-gray-900 px-4 h-full'
      />
      <div className='ingredient-buttons col-span-1 flex justify-center gap-4 items-center'>
        <Button border='none' onClick={() => removeMember(ingredientIndex)}>
          <div className='w-6 aspect-square bg-white'></div>
        </Button>
      </div>
    </div>
  );
}
