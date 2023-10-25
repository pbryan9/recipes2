import type { UseFieldArrayRemove } from 'react-hook-form';
import type { RouterInputs } from '../../../lib/trpc/trpc';
import TrashIcon from '../../../assets/icons/TrashIcon';
import FormInput from './FormInput';

type FormInput = RouterInputs['recipes']['create'];

type ProcedureStepItemProps = {
  procedureIndex: number;
  groupIndex: number;
  removeMember: UseFieldArrayRemove;
};

export default function ProcedureStepItem({
  procedureIndex,
  groupIndex,
  removeMember,
}: ProcedureStepItemProps) {
  const registrationPath = `procedureGroups.${groupIndex}.procedureSteps.${procedureIndex}`;

  return (
    <div className='procedure-step w-full h-full flex items-center gap-4'>
      <div className='w-full flex shrink gap-0'>
        <FormInput
          as='textarea'
          fieldLabel='Description*'
          fieldName={`${registrationPath}.description`}
          // {...{ getFieldState, setFocus, errors, register }}
        />
      </div>
      <div className='procedure-buttons flex justify-center items-center self-start'>
        <button
          type='button'
          className={`h-14 aspect-square flex items-center justify-center`}
          onClick={() => removeMember(procedureIndex)}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

// function createTimer() {
//   // TODO:
//   console.log('still have to finish this part');
// }
