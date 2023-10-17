import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from './Button';
import ButtonContainer from './ButtonContainer';

import type {
  Control,
  UseFormRegister,
  UseFieldArrayRemove,
  UseFormGetFieldState,
} from 'react-hook-form';
import type { GroupType } from './GroupsWrapper';
import IngredientItem from './IngredientItem';
import ProcedureStepItem from './ProcedureStepItem';
import { RouterInputs } from '../../../lib/trpc/trpc';
import PlusIcon from '../../../assets/icons/PlusIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';

type FormInput = RouterInputs['recipes']['create'];

type GroupContainerProps = {
  control: Control<FormInput, any>;
  register: UseFormRegister<FormInput>;
  groupIndex: number;
  groupTitle: string;
  groupType: GroupType;
  removeGroup: UseFieldArrayRemove;
  dirtyFields: any;
  errors: any;
  setFocus: any;
  getFieldState: UseFormGetFieldState<FormInput>;
};

export default function GroupContainer({
  control,
  register,
  groupIndex,
  removeGroup,
  groupType,
  dirtyFields,
  errors,
  setFocus,
  getFieldState,
}: GroupContainerProps) {
  // set up field array
  const {
    fields,
    remove: removeMember,
    append,
  } = useFieldArray({
    name: getFieldArrayName(),
    control,
  });

  const groupMembers = fields.map((field, index) => {
    if (groupType === 'ingredientGroups')
      return (
        <IngredientItem
          key={field.id}
          {...{
            ingredientIndex: index,
            groupIndex,
            register,
            removeMember,
            dirtyFields,
            errors,
            setFocus,
            getFieldState,
          }}
        />
      );

    if (groupType === 'procedureGroups')
      return (
        <ProcedureStepItem
          key={field.id}
          {...{
            procedureIndex: index,
            groupIndex,
            register,
            removeMember,
            dirtyFields,
            errors,
            setFocus,
            getFieldState,
          }}
        />
      );
  });

  const addButtonCaptions = {
    ingredientGroups: 'Add ingredients',
    procedureGroups: 'Add steps',
  };

  useEffect(() => {
    // remove group if all ingredients are deleted
    if (groupMembers.length < 1) removeGroup(groupIndex);
  }, [groupMembers.length]);

  return (
    <>
      {groupMembers}

      <div className='w-full flex justify-end gap-4 border-b border-b-outline-variant pb-6 last-of-type:border-b-0'>
        <button
          type='button'
          onClick={() => append({ description: '' })}
          className='rounded-full flex items-center gap-2 pl-4 pr-6 h-10 label-large bg-secondary-container text-on-secondary-container'
        >
          <PlusIcon size={18} />
          {addButtonCaptions[groupType]}
        </button>

        <button
          type='button'
          onClick={() => removeGroup(groupIndex)}
          className='rounded-full flex items-center gap-2 pl-4 pr-6 h-10 label-large bg-transparent text-primary border border-outline'
        >
          <TrashIcon size={18} color='#B5D269' />
          Remove group
        </button>
      </div>
    </>
  );

  function getFieldArrayName() {
    const memberMap = {
      ingredientGroups: 'ingredients',
      procedureGroups: 'procedureSteps',
    };

    return `${groupType}.${groupIndex}.${memberMap[groupType]}` as
      | 'ingredientGroups.0.ingredients'
      | 'procedureGroups.0.procedureSteps';
  }
}
