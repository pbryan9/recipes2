import { useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import Button from './Button';
import ButtonContainer from './ButtonContainer';

import type {
  Control,
  UseFormRegister,
  UseFieldArrayRemove,
} from 'react-hook-form';
import type { GroupType } from './GroupsListing';
import { FormInputs } from '../../../../../api-server/validators/newRecipeFormValidator';
import IngredientItem from './IngredientItem';
import ProcedureStepItem from './ProcedureStepItem';
import { RouterInputs } from '../../../utils/trpc/trpc';

type GroupContainerProps = {
  control: Control<RouterInputs['recipes']['create'], any>;
  register: UseFormRegister<RouterInputs['recipes']['create']>;
  groupIndex: number;
  groupTitle: string;
  groupType: GroupType;
  removeGroup: UseFieldArrayRemove;
};

export default function GroupContainer({
  control,
  register,
  groupIndex,
  removeGroup,
  groupType,
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
          }}
        />
      );

    if (groupType === 'procedureGroups')
      return (
        <ProcedureStepItem
          key={field.id}
          {...{ procedureIndex: index, groupIndex, register, removeMember }}
        />
      );
  });

  const addButtonCaptions = {
    ingredientGroups: 'Add Ingredients',
    procedureGroups: 'Add Steps',
  };

  useEffect(() => {
    // remove group if all ingredients are deleted
    if (groupMembers.length < 1) removeGroup(groupIndex);
  }, [groupMembers.length]);

  return (
    <>
      {groupMembers}
      <ButtonContainer>
        <Button onClick={() => append({ description: '' })}>
          {addButtonCaptions[groupType]}
        </Button>
        <Button onClick={() => removeGroup(groupIndex)}>
          Remove This Group
        </Button>
      </ButtonContainer>
      <div className='col-span-full mx-auto w-3/4 border-b border-gray-400' />
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
