import type {
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetFieldState,
  UseFormRegister,
  UseFormSetFocus,
} from 'react-hook-form';
import { RouterInputs } from '../../../lib/trpc/trpc';
import FormInput from './FormInput';
import TrashIcon from '../../../assets/icons/TrashIcon';

type FormInput = RouterInputs['recipes']['create'];

type IngredientItemProps = {
  ingredientIndex: number;
  groupIndex: number;
  register: UseFormRegister<FormInput>;
  removeMember: UseFieldArrayRemove;
  setFocus: UseFormSetFocus<FormInput>;
  errors: FieldErrors<FormInput>;
  getFieldState: UseFormGetFieldState<FormInput>;
};

export default function IngredientItem({
  ingredientIndex,
  groupIndex,
  register,
  removeMember,
  errors,
  setFocus,
  getFieldState,
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
          {...{ errors, register, setFocus, getFieldState }}
        />
        <FormInput
          fieldLabel='Measure'
          supportingText='e.g. cup, oz, box'
          fieldName={`${registrationPath}.uom`}
          variant='cluster'
          clusterInputPosition='inner'
          inputWidth='small'
          {...{ errors, register, setFocus, getFieldState }}
        />
        <FormInput
          fieldLabel='Description*'
          fieldName={`${registrationPath}.description`}
          variant='cluster'
          clusterInputPosition='right'
          inputWidth='full'
          {...{ errors, register, setFocus, getFieldState }}
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
