import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '../../lib/hooks/useUser';
import requestPasswordResetValidator, {
  type RequestPasswordResetInput,
} from '../../../../api-server/validators/requestPasswordResetValidator';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Modal from './Modal';
import { useModal } from '../../lib/context/ModalContextProvider';

type ForgotPasswordModalProps = {};

export default function ForgotPasswordModal({}: ForgotPasswordModalProps) {
  const { requestRecoveryCode, isLoggedIn, isLoading } = useUser();
  const { dismissModal, openModal } = useModal();
  const methods = useForm<RequestPasswordResetInput>({
    resolver: zodResolver(requestPasswordResetValidator),
  });

  const { handleSubmit, setFocus } = methods;

  useEffect(() => {
    setFocus('email');
  }, []);

  useEffect(() => {
    if (isLoggedIn) dismissModal();
  }, [isLoggedIn]);

  function onSubmit({ email }: RequestPasswordResetInput) {
    console.log('hello');
    requestRecoveryCode(email, () => openModal('recoveryCodeRequested'));
  }

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Email' fieldName='email' />
        <button type='submit' className='hidden' disabled={isLoading}></button>
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
        {isLoading ? 'Please wait...' : 'Send reset link'}
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
