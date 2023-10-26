import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '../../lib/hooks/useUser';
import resetPasswordValidator, {
  type ResetPasswordInput,
} from '../../../../api-server/validators/resetPasswordValidator';
import { useModal } from '../../lib/context/ModalContextProvider';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Modal from './Modal';

type UpdatePasswordModalProps = {};

export default function UpdatePasswordModal({}: UpdatePasswordModalProps) {
  const { resetPassword, isLoading, error, clearError } = useUser();
  const { dismissModal, openModal } = useModal();
  const methods = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordValidator),
  });

  const { handleSubmit, setFocus } = methods;

  function onSubmit(input: ResetPasswordInput) {
    resetPassword(input, () => openModal('passwordChangeSuccess'));
  }

  useEffect(() => {
    setFocus('oldPassword');

    return () => clearError('resetPassword');
  }, []);

  useEffect(() => {
    if (error.resetPassword) {
      switch (error.resetPassword) {
        case 'userId': {
          console.warn('Somehow the user id is messed up');
          break;
        }
        case 'Error updating user password': {
          console.warn('Somehow there was an issue updating the user');
          break;
        }
        case 'oldPassword': {
          methods.setError(
            'oldPassword',
            { message: 'Password is incorrect' },
            { shouldFocus: true }
          );
          methods.resetField('oldPassword', { keepError: true });
          break;
        }
      }
    }
  }, [error]);

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput
          fieldLabel='Old password*'
          fieldName='oldPassword'
          type='password'
        />
        <FormInput
          fieldLabel='New password*'
          fieldName='newPassword'
          type='password'
        />
        <FormInput
          fieldLabel='Confirm password*'
          fieldName='confirmPassword'
          type='password'
        />
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
      <Button onClick={handleSubmit(onSubmit)} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Update password'}
      </Button>
    </>
  );

  return (
    <Modal
      headline='Update password'
      caption='Use this form to change your password'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
