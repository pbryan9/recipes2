import type { UseFieldArrayRemove } from 'react-hook-form';
import { RouterInputs } from '../../../lib/trpc/trpc';
import FormInput from './FormInput';
import TrashIcon from '../../../assets/icons/TrashIcon';

type FormInput = RouterInputs['recipes']['create'];

type IngredientItemProps = {
  ingredientIndex: number;
  groupIndex: number;
  removeMember: UseFieldArrayRemove;
};

export default function IngredientItem({
  ingredientIndex,
  groupIndex,
  removeMember,
}: IngredientItemProps) {
  const registrationPath = `ingredientGroups.${groupIndex}.ingredients.${ingredientIndex}`;

  return (
    <div className='ingredient-group w-full h-full flex items-center gap-4'>
      <div className='w-full flex shrink gap-0'>
        <FormInput
          fieldLabel='Quantity'
          fieldName={`${registrationPath}.qty`}
          variant='cluster'
          clusterInputPosition='left'
          inputWidth='small'
        />
        <FormInput
          fieldLabel='Measure'
          supportingText='e.g. cup, oz, box'
          fieldName={`${registrationPath}.uom`}
          variant='cluster'
          clusterInputPosition='inner'
          inputWidth='small'
        />
        <FormInput
          fieldLabel='Description*'
          fieldName={`${registrationPath}.description`}
          variant='cluster'
          clusterInputPosition='right'
          inputWidth='full'
        />
      </div>

      <div className='ingredient-buttons flex justify-center items-center self-start'>
        <button
          type='button'
          className={`h-14 aspect-square flex items-center justify-center`}
          onClick={() => removeMember(ingredientIndex)}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
