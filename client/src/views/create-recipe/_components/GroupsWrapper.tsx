import React from 'react';
import {
  useFieldArray,
  type Control,
  type UseFormRegister,
  UseFormGetFieldState,
} from 'react-hook-form';

import GroupContainer from './GroupContainer';
import Button from './Button';

import { RouterInputs } from '../../../lib/trpc/trpc';
import FormInput from './FormInput';
import PlusIcon from '../../../assets/icons/PlusIcon';

export type GroupType = 'ingredientGroups' | 'procedureGroups';

type FormInput = RouterInputs['recipes']['create'];

type GroupsWrapperProps = {
  control: Control<FormInput, any>;
  register: UseFormRegister<FormInput>;
  groupType: GroupType;
  dirtyFields: any;
  errors: any;
  setFocus: any;
  getFieldState: UseFormGetFieldState<FormInput>;
};

export default function GroupsWrapper({
  control,
  register,
  groupType,
  dirtyFields,
  errors,
  setFocus,
  getFieldState,
}: GroupsWrapperProps) {
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
      <FormInput
        {...{
          dirtyFields,
          errors,
          fieldLabel: 'Group label',
          supportingText:
            fields.length > 1
              ? 'Required when using multiple groups'
              : 'Optional when using only using one group',
          fieldName: getGroupTitleRegistrationString(groupIndex),
          register,
          setFocus,
          getFieldState,
        }}
      />
      {/* <label htmlFor={`group-${groupIndex}-title`} className='col-span-2'>
            Group Label
          </label>
          <input
            {...register(getGroupTitleRegistrationString(groupIndex))}
            type='text'
            placeholder='e.g., the dry team'
            className='col-span-5 h-full rounded-md px-4 text-gray-900'
            id={`group-${groupIndex}-title`}
          ></input> */}
      <GroupContainer
        {...{
          control,
          groupIndex,
          register,
          removeGroup,
          groupTitle,
          groupType,
          dirtyFields,
          errors,
          setFocus,
          getFieldState,
        }}
        key={id}
      />
    </React.Fragment>
  ));

  function appendNewGroup() {
    if (groupType === 'ingredientGroups') {
      append({ groupTitle: '', ingredients: [{ description: '' }] });
    } else if (groupType === 'procedureGroups') {
      append({ groupTitle: '', procedureSteps: [{ description: '' }] });
    } else throw new Error('Cannot append group type: invalid type provided.');
  }

  return (
    <>
      <div className='w-full flex flex-col items-stretch rounded-[12px] p-6 bg-surface-container-high shadow-md gap-6'>
        {groupList}
      </div>
      <Button icon={<PlusIcon size={18} />} onClick={appendNewGroup}>
        Create new group
      </Button>
    </>
  );

  function getGroupTitleRegistrationString(groupIndex: number) {
    return `${groupType}.${groupIndex}.groupTitle` as
      | 'ingredientGroups.0.groupTitle'
      | 'procedureGroups.0.procedureSteps';
  }
}
