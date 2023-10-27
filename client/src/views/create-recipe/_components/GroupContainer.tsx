import { useEffect } from 'react';
import {
  useFieldArray,
  useFormContext,
  type UseFieldArrayRemove,
} from 'react-hook-form';
import type { GroupType } from './GroupsWrapper';
import { useModal } from '../../../lib/context/ModalContextProvider';

import IngredientItem from './IngredientItem';
import ProcedureStepItem from './ProcedureStepItem';
import PlusIcon from '../../../assets/icons/PlusIcon';
import TrashIcon from '../../../assets/icons/TrashIcon';
import Button from '../../../components/Button';

type GroupContainerProps = {
  groupIndex: number;
  groupTitle: string;
  groupType: GroupType;
  removeGroup: UseFieldArrayRemove;
};

export default function GroupContainer({
  groupIndex,
  removeGroup,
  groupType,
}: GroupContainerProps) {
  // set up field array
  const { control } = useFormContext();

  const { openModal } = useModal();

  function deleteConfirmed() {
    removeGroup(groupIndex);
  }

  function deleteCancelled() {
    window.removeEventListener('delete_confirmed', deleteConfirmed);
    window.removeEventListener('delete_cancelled', deleteCancelled);
  }

  function deleteThisItem() {
    window.addEventListener('delete_confirmed', deleteConfirmed);
    window.addEventListener('delete_cancelled', deleteCancelled);

    openModal('confirmToDeleteItem');
  }

  useEffect(() => {
    // clean up event listeners
    return deleteCancelled;
  }, []);

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
            removeMember,
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
            removeMember,
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

        <Button
          type='button'
          icon={<TrashIcon size={18} color='#FFB4AB' />}
          variant='danger'
          onClick={deleteThisItem}
          // className='rounded-full flex items-center gap-2 pl-4 pr-6 h-10 label-large bg-transparent text-primary border border-outline'
        >
          Remove group
        </Button>
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
