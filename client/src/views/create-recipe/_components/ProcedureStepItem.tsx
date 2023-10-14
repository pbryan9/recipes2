import type { UseFieldArrayRemove, UseFormRegister } from 'react-hook-form';
import Button from './Button';
import { FormInputs } from '../../../../../api-server/validators/newRecipeFormValidator';
import { RouterInputs } from '../../../lib/trpc/trpc';

type ProcedureStepItemProps = {
  procedureIndex: number;
  groupIndex: number;
  register: UseFormRegister<RouterInputs['recipes']['create']>;
  removeMember: UseFieldArrayRemove;
};

export default function ProcedureStepItem({
  procedureIndex,
  groupIndex,
  register,
  removeMember,
}: ProcedureStepItemProps) {
  const registrationPath = `procedureGroups.${groupIndex}.procedureSteps.${procedureIndex}`;

  return (
    <div className='procedure-step grid grid-cols-8 col-span-full h-full'>
      <input
        {...register(
          `${registrationPath}.description` as 'procedureGroups.0.procedureSteps.0.description'
        )}
        type='text'
        className='col-span-7 rounded-md text-gray-900 px-4'
      />
      <div className='ingredient-buttons col-span-1 flex justify-center gap-4 items-center'>
        <Button border='none' onClick={() => removeMember(procedureIndex)}>
          <div className='w-6 aspect-square bg-white'></div>
        </Button>
        {/* // TODO: implement timer feature */}
        {/* <Button border='none' onClick={createTimer}>
          <div className='w-6 aspect-square bg-gray-400'></div>
        </Button> */}
      </div>
    </div>
  );
}

function createTimer() {
  // TODO:
  console.log('still have to finish this part');
}
