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

type IngredientsSectionProps = {
  control: Control<FormInput>;
  setFocus: UseFormSetFocus<FormInput>;
  errors: FieldErrors<FormInput>;
  register: UseFormRegister<FormInput>;
  getFieldState: UseFormGetFieldState<FormInput>;
};

export default function IngredientsSection({
  control,
  errors,
  register,
  setFocus,
  getFieldState,
}: IngredientsSectionProps) {
  return (
    <section
      id='ingredients-section'
      className='w-full flex flex-col items-start gap-6 border-y border-y-outline-variant py-6'
    >
      <h2 className='title-large'>Ingredients</h2>
      <GroupsWrapper
        groupType='ingredientGroups'
        {...{ register, control, errors, setFocus, getFieldState }}
      />
    </section>
  );
}
