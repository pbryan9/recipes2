import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import authenticateUserValidator, {
  type AuthenticateUserInput,
} from '../../../../api-server/validators/authenticateUserValidator';

import SectionHeader from '../../components/SectionHeader';
import StandardMainContainer from '../../components/StandardMainContainer';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../lib/context/UserContextProvider';

const defaultValues: AuthenticateUserInput = {
  username: '',
  password: '',
};

export default function SignInView() {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthenticateUserInput>({
    resolver: zodResolver(authenticateUserValidator),
    defaultValues,
  });

  function onSubmit(formInputs: AuthenticateUserInput) {
    // formSubmit.mutate(formInputs);
    if (!userCtx.login) {
      console.warn('userCtx.login is not defined yet');
      return;
    }
    userCtx.login(formInputs);
  }

  useEffect(() => {
    if (userCtx.isLoggedIn) navigate('/');
  }, [userCtx.isLoggedIn]);

  return (
    <>
      <SectionHeader>Sign In</SectionHeader>
      <StandardMainContainer>
        <div className='w-full min-h-[calc(100vh_-_80px_-_128px)] flex flex-col gap-6 items-center justify-center'>
          <h1>Sign In</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-center gap-6'
          >
            <div>
              <label htmlFor='authenticate-username'>Username</label>{' '}
              <input
                type='text'
                className='text-gray-800'
                id='authenticate-username'
                {...register('username')}
              ></input>
              {errors.username?.message && (
                <p className='text-red-400'>{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor='authenticate-password'>Password</label>{' '}
              <input
                type='password'
                className='text-gray-800'
                id='authenticate-password'
                {...register('password')}
              ></input>
              {errors.password?.message && (
                <p className='text-red-400'>{errors.password.message}</p>
              )}
            </div>

            <button type='submit'>Submit</button>
          </form>
        </div>
      </StandardMainContainer>
    </>
  );
}
