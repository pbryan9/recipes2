import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import useUser from '../../lib/hooks/useUser';
import newUserFormValidator, {
  type NewUserInput,
} from '../../../../api-server/validators/newUserFormValidator';

import Button from '../Button';
import FormInput from '../../views/create-recipe/_components/FormInput';
import LoginIcon from '../../assets/icons/LoginIcon';
import Modal from './Modal';
import LoadingIcon from '../../assets/icons/LoadingIcon';

type SignUpModalProps = {
  dismissModal: () => void;
};

export default function SignUpModal({ dismissModal }: SignUpModalProps) {
  const { isLoggedIn, isLoading, createUser } = useUser();
  const methods = useForm<NewUserInput>({
    resolver: zodResolver(newUserFormValidator),
  });

  const { handleSubmit, setFocus } = methods;

  useEffect(() => {
    setFocus('email');
  }, []);

  useEffect(() => {
    if (isLoggedIn) dismissModal();
  }, [isLoggedIn]);

  function onSubmit(formInput: NewUserInput) {
    createUser(formInput);
  }

  const modalBody = (
    <FormProvider {...methods}>
      <form
        className='flex flex-col w-full gap-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormInput fieldLabel='Email' fieldName='email' />
        <FormInput fieldLabel='Username' fieldName='username' />
        <FormInput fieldLabel='Password' fieldName='password' type='password' />
        <FormInput
          fieldLabel='Confirm password'
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
      <Button
        icon={isLoading ? <LoadingIcon /> : <LoginIcon />}
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Create account'}
      </Button>
    </>
  );

  return (
    <Modal
      headline='Create account'
      caption='Sign up to create & manage your own recipes'
      body={modalBody}
      buttons={modalButtons}
    />
  );
}
