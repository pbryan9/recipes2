import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '../../lib/hooks/useUser';
import requestPasswordResetValidator, {
  type RequestPasswordResetInput,
} from '../../../../api-server/validators/requestPasswordResetValidator.ts';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Modal from './Modal';

type PasswordResetModalProps = {
  dismissModal: () => void;
};

export default function PasswordResetModal({
  dismissModal,
}: PasswordResetModalProps) {
  const {
    requestRecoveryCode: requestPasswordReset,
    isLoggedIn,
    isLoading,
  } = useUser();
  const methods = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetValidator),
  });

  const {
    handleSubmit,
    setFocus,
    formState: { errors },
  } = methods;

  useEffect(() => {
    setFocus('email');
  }, []);

  useEffect(() => {
    if (isLoggedIn) dismissModal();
  }, [isLoggedIn]);

  function onSubmit({ email }: RequestPasswordResetInput) {
    requestPasswordReset(email);
  }

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Email' fieldName='email' />
        <button
          type='submit'
          className='invisible'
          disabled={isLoading}
        ></button>
      </form>
    </FormProvider>
  );

  const modalButtons = (
    <>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button
        icon={<LoginIcon />}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Send reset link'}
      </Button>
    </>
  );

  return (
    <Modal
      headline='Forgot password'
      caption='Enter your email to receive a password reset code'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
