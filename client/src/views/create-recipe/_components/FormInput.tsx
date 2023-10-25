import { type FieldErrors, useFormContext } from 'react-hook-form';
import { RouterInputs } from '../../../lib/trpc/trpc';

type FormInput = RouterInputs['recipes']['create'];

type FormInputVariants = 'standard' | 'cluster';

type ClusterInputPosition = 'left' | 'inner' | 'right';

type FormInputWidth = 'small' | 'medium' | 'large' | 'full';

type FormInputProps = {
  fieldName: string;
  fieldLabel: string;

  as?: 'input' | 'textarea';
  type?: 'text' | 'password';
  supportingText?: string;
  inputWidth?: FormInputWidth;
  variant?: FormInputVariants;
  clusterInputPosition?: ClusterInputPosition;
};

export default function FormInput({
  fieldName,
  fieldLabel,

  as = 'input',
  type = 'text',
  supportingText = '',
  variant = 'standard',
  inputWidth = 'full',
  clusterInputPosition = undefined,
}: FormInputProps) {
  if (variant === 'cluster' && !clusterInputPosition)
    throw new Error(
      'Must provide clusterInputPosition when using cluster variant'
    );

  const { formState, getFieldState, setFocus, register, watch } =
    useFormContext();
  const { errors } = formState;

  const { invalid } = getFieldState(fieldName as keyof FormInput, formState);

  let fieldValue = watch(fieldName);

  let errMsg = invalid
    ? accessErrors(fieldName as keyof FormInput, errors)
    : null;

  const inputWidthLookup: Record<FormInputWidth, string> = {
    full: 'w-full',
    large: 'w-[600px]',
    medium: 'w-80',
    small: 'w-44',
  };

  const radiusLookup: Record<ClusterInputPosition, string> = {
    inner: '',
    left: 'rounded-tl-[5px]',
    right: 'rounded-tr-[5px]',
  };

  const InputType = as;

  return (
    <div
      className={`h-fit flex flex-col items-stretch ${inputWidthLookup[inputWidth]}`}
    >
      <div
        onClick={() => {
          setFocus(fieldName as keyof FormInput);
        }}
        className={`input-group cursor-text relative min-h-[56px] flex justify-start ${
          fieldValue ? 'items-end' : 'items-center'
        } ${
          variant === 'cluster'
            ? radiusLookup[clusterInputPosition!]
            : 'rounded-t-[5px]'
        } ${
          variant === 'cluster' && clusterInputPosition !== 'right'
            ? 'border-r border-r-outline-variant'
            : ''
        } gap-0 px-4 py-2 bg-surface-container-highest border-b border-b-on-surface-variant`}
      >
        <label
          htmlFor={fieldName}
          className={`left-4 leading-none absolute cursor-text ${
            fieldValue
              ? `body-small ${
                  invalid ? 'text-error' : 'text-primary'
                } absolute top-2`
              : 'body-large text-on-surface-variant top-1/2 -translate-y-1/2'
          }`}
        >
          {fieldLabel}
        </label>
        <InputType
          type={as === 'input' ? type : undefined}
          wrap={as === 'textarea' ? 'soft' : undefined}
          rows={as === 'textarea' ? 1 : undefined}
          id={fieldName}
          {...register(fieldName)}
          className={`w-full h-fit body-large bg-transparent text-on-surface leading-none focus:outline-none ${
            as === 'textarea' ? 'mt-3' : ''
          }`}
        />
      </div>
      {invalid ? (
        <p className={`px-4 body-small text-error`}>{errMsg}</p>
      ) : supportingText ? (
        <p className={`px-4 body-small text-on-surface-variant leading-tight`}>
          {supportingText}
        </p>
      ) : (
        ''
      )}
    </div>
  );
}

function accessErrors(
  fieldName: keyof FormInput,
  errors: FieldErrors<FormInput>
) {
  let fieldNameArray = fieldName.split('.');

  if (fieldNameArray.length < 1) return null;

  if (fieldNameArray.length === 1) return errors[fieldName]?.message;

  if (!errors[fieldNameArray[0] as keyof FormInput]) return null;

  return accessErrors(
    fieldNameArray.slice(1).join('.') as keyof FormInput,
    errors[fieldNameArray[0] as keyof FormInput] as FieldErrors<FormInput>
  );
}
