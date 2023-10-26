import { useEffect } from 'react';
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
import { useModal } from '../../lib/context/ModalContextProvider';

export default function RecoverPasswordView() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { attemptPasswordRecovery, isLoading, isLoggedIn, error, clearError } =
    useUser();
  const { openModal } = useModal();

  useEffect(() => {
    return () => clearError('attemptPasswordRecovery');
  }, []);

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  const email = params.get('email') || '';
  const resetCode = parseInt(params.get('code') ?? '-1');

  const methods = useForm<RecoverPasswordInput>({
    resolver: zodResolver(recoverPasswordValidator),
    defaultValues: {
      email: email ?? '',
      resetCode: resetCode > 0 ? resetCode : undefined,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (error.attemptPasswordRecovery) {
      switch (error.attemptPasswordRecovery) {
        case 'recoveryCode_mismatch': {
          methods.setError('resetCode', { message: 'Invalid recovery code' });
          break;
        }
        case 'recoveryCode_stale': {
          methods.setError('resetCode', {
            message: 'Recovery code has expired',
          });
          break;
        }
        case 'email_mismatch': {
          methods.setError('email', {
            message: 'Email address does not match',
          });
          break;
        }
      }
    }
  }, [error]);

  const { handleSubmit } = methods;

  function onSubmit(input: RecoverPasswordInput) {
    attemptPasswordRecovery(input, () => openModal('passwordChangeSuccess'));
  }

  return (
    <main className='p-6 flex flex-col gap-6 justify-center items-center min-h-screen w-screen'>
      <article className='w-fit min-w-[280px] max-w-[560px] mx-auto flex flex-col gap-4 bg-surface-container-high max-h-[67vw] h-fit overflow-y-auto rounded-[28px] p-6 shadow-2xl'>
        <h1 className='headline-small flex flex-col gap-6 items-start'>
          Recover password
        </h1>
        <FormProvider {...methods}>
          <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormInput fieldLabel='Email' fieldName='email' inputWidth='full' />
            <FormInput
              fieldLabel='Recovery code'
              fieldName='resetCode'
              inputWidth='full'
            />
            <FormInput
              fieldLabel='New password'
              fieldName='password'
              type='password'
              inputWidth='full'
            />
            <FormInput
              fieldLabel='Confirm password'
              fieldName='confirmPassword'
              type='password'
              inputWidth='full'
            />
            <button type='submit' className='hidden' disabled={isLoading} />
          </form>
        </FormProvider>
        <div className='flex justify-end pt-6 gap-4'>
          {error.attemptPasswordRecovery && (
            <Button variant='text' onClick={() => openModal('forgotPassword')}>
              Request another code
            </Button>
          )}
          <Button
            icon={<LoginIcon />}
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Set new password'}
          </Button>
        </div>
      </article>
    </main>
  );
}
