import React from 'react';
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
} from 'react-hook-form';

import GroupContainer from './GroupContainer';
import ButtonContainer from './ButtonContainer';
import Button from './Button';

import type { FormInputs } from '../../../../../api-server/validators/newRecipeFormValidator';

export type GroupType = 'ingredientGroups' | 'procedureGroups';

type GroupListingProps = {
  control: Control<FormInputs, any>;
  register: UseFormRegister<FormInputs>;
  groupType: GroupType;
};

export default function GroupListing({
  control,
  register,
  groupType,
}: GroupListingProps) {
  const {
    fields,
    append,
    remove: removeGroup,
  } = useFieldArray({
    name: groupType,
    control,
  });

  const groupList = fields.map(({ id, groupTitle }, groupIndex) => (
    <React.Fragment key={id}>
      {fields.length > 1 && (
        <>
          <label htmlFor={`group-${groupIndex}-title`} className='col-span-2'>
            Group Label
          </label>
          <input
            {...register(getGroupTitleRegistrationString(groupIndex))}
            type='text'
            placeholder='e.g., the dry team'
            className='col-span-5 h-full rounded-md px-4 text-gray-900'
            id={`group-${groupIndex}-title`}
          ></input>
        </>
      )}
      <GroupContainer
        {...{
          control,
          groupIndex,
          register,
          removeGroup,
          groupTitle,
          groupType,
        }}
        key={id}
      />
    </React.Fragment>
  ));

  function appendNewGroup() {
    console.log('groupType:', groupType);
    if (groupType === 'ingredientGroups') {
      append({ groupTitle: '', ingredients: [{ description: '' }] });
    } else if (groupType === 'procedureGroups') {
      append({ groupTitle: '', procedureSteps: [{ description: '' }] });
    } else throw new Error('Cannot append group type: invalid type provided.');
  }

  return (
    <>
      {groupList}
      <ButtonContainer>
        <Button onClick={appendNewGroup}>Create New Group</Button>
      </ButtonContainer>
    </>
  );

  function getGroupTitleRegistrationString(groupIndex: number) {
    return `${groupType}.${groupIndex}.groupTitle` as
      | 'ingredientGroups.0.groupTitle'
      | 'procedureGroups.0.procedureSteps';
  }
}
