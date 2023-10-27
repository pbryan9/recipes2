import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { type RouterInputs } from '../../../lib/trpc/trpc';

import GroupContainer from './GroupContainer';
import Button from '../../../components/Button';
import FormInput from './FormInput';
import PlusIcon from '../../../assets/icons/PlusIcon';

export type GroupType = 'ingredientGroups' | 'procedureGroups';

type FormInput = RouterInputs['recipes']['create'];

type GroupsWrapperProps = {
  groupType: GroupType;
};

export default function GroupsWrapper({ groupType }: GroupsWrapperProps) {
  const { control } = useFormContext<FormInput>();

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
          fieldLabel: 'Group label',
          supportingText:
            fields.length > 1
              ? 'Required when using multiple groups'
              : 'Optional when using only using one group',
          fieldName: getGroupTitleRegistrationString(groupIndex),
        }}
      />

      <GroupContainer
        {...{
          groupIndex,
          groupTitle: groupTitle || '',
          groupType,
          removeGroup,
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
