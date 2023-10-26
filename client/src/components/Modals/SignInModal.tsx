import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '../../lib/hooks/useUser';
import authenticateUserValidator, {
  type AuthenticateUserInput,
} from '../../../../api-server/validators/authenticateUserValidator';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Modal from './Modal';
import { useModal } from '../../lib/context/ModalContextProvider';

type SignInModalProps = {
  dismissModal: () => void;
};

export default function SignInModal({ dismissModal }: SignInModalProps) {
  const { isLoggedIn, isLoading, login, error, clearError } = useUser();
  const methods = useForm<AuthenticateUserInput>({
    resolver: zodResolver(authenticateUserValidator),
  });
  const { openModal } = useModal();

  const { handleSubmit, setFocus } = methods;

  useEffect(() => {
    if (isLoggedIn) dismissModal();
  }, [isLoggedIn]);

  useEffect(() => {
    setFocus('username');

    return () => {
      clearError('login');
    };
  }, []);

  useEffect(() => {
    if (error.login) {
      switch (error.login) {
        case 'username': {
          methods.setError('username', { message: 'Username does not exist' });
          break;
        }
        case 'password': {
          methods.setError(
            'password',
            { message: 'Invalid password' },
            { shouldFocus: true }
          );
          methods.resetField('password', { defaultValue: '', keepError: true });
        }
      }
    }
  }, [error]);

  function onSubmit(formInput: AuthenticateUserInput) {
    login(formInput);
  }

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Username' fieldName='username' />
        <FormInput fieldLabel='Password' fieldName='password' type='password' />
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
      <Button variant='text' onClick={() => openModal('forgotPassword')}>
        Forgot password
      </Button>
      <Button onClick={dismissModal} variant='text'>
        Cancel
      </Button>
      <Button
        icon={<LoginIcon />}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Sign In'}
      </Button>
    </>
  );

  return (
    <Modal
      headline='Sign in'
      caption='Sign in to your account to create, edit & star recipes'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
