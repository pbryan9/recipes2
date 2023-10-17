import {
  Control,
  UseFormGetFieldState,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetFocus,
} from 'react-hook-form';
import GroupsWrapper from './GroupsWrapper';
import { RouterInputs } from '../../../lib/trpc/trpc';

type FormInput = RouterInputs['recipes']['create'];

type ProcedureSectionProps = {
  control: Control<FormInput>;
  setFocus: UseFormSetFocus<FormInput>;
  errors: FieldErrors<FormInput>;
  register: UseFormRegister<FormInput>;
  getFieldState: UseFormGetFieldState<FormInput>;
};

export default function ProcedureSection({
  control,
  errors,
  register,
  setFocus,
  getFieldState,
}: ProcedureSectionProps) {
  return (
    <section
      id='procedure-section'
      className='w-full flex flex-col items-start gap-6'
    >
      <h2 className='title-large'>Procedure</h2>
      <GroupsWrapper
        groupType='procedureGroups'
        {...{ register, control, errors, setFocus, getFieldState }}
      />
    </section>
  );
}
