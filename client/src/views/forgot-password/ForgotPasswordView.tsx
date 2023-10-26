import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';

import recoverPasswordValidator, {
  type RecoverPasswordInput,
} from '../../../../api-server/validators/recoverPasswordValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import FormInput from '../create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Button from '../../components/Button';
import useUser from '../../lib/hooks/useUser';
import { useEffect } from 'react';

export default function ForgotPasswordView() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { attemptPasswordRecovery, isLoading, isLoggedIn } = useUser();

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  const email = params.get('email') || '';
  const resetCode = parseInt(params.get('code') ?? '-1');

  // console.log({ email, resetCode });
  const methods = useForm<RecoverPasswordInput>({
    resolver: zodResolver(recoverPasswordValidator),
    defaultValues: {
      email: email ?? '',
      resetCode: resetCode > 0 ? resetCode : undefined,
      password: '',
      confirmPassword: '',
    },
  });

  const { handleSubmit } = methods;

  function onSubmit(input: RecoverPasswordInput) {
    attemptPasswordRecovery(input);
  }

  return (
    <main className='p-6 flex flex-col gap-6 justify-center items-center min-h-screen w-screen'>
      <article className='bg-surface-container p-6 rounded-[12px] shadow-md'>
        <h1 className='headline-medium flex flex-col gap-6 items-start'>
          Recover password
        </h1>
        <FormProvider {...methods}>
          <form className='flex flex-col gap-4'>
            <FormInput fieldLabel='Email' fieldName='email' />
            <FormInput fieldLabel='Recovery code' fieldName='resetCode' />
            <FormInput
              fieldLabel='New password'
              fieldName='password'
              type='password'
            />
            <FormInput
              fieldLabel='Confirm password'
              fieldName='confirmPassword'
              type='password'
            />
          </form>
          <Button
            icon={<LoginIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Set new password'}
          </Button>
        </FormProvider>
      </article>
    </main>
  );
}
