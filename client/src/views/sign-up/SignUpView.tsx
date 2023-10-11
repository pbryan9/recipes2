import { useNavigate } from 'react-router-dom';
import useUser from '../../utils/hooks/useUser';
import { useEffect } from 'react';
import StandardMainContainer from '../../components/StandardMainContainer';
import SectionHeader from '../../components/SectionHeader';
import newUserFormSchema, {
  type NewUserInput,
} from '../../../../api-server/validators/newUserFormValidator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const defaultValues: NewUserInput = {
  username: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpView() {
  const navigate = useNavigate();
  const { isLoggedIn, createUser } = useUser();

  useEffect(() => {
    if (isLoggedIn) navigate('/');
  }, [isLoggedIn]);

  const { register, handleSubmit } = useForm<NewUserInput>({
    defaultValues,
    resolver: zodResolver(newUserFormSchema),
  });

  function onSubmit(input: NewUserInput) {
    createUser!(input);
  }

  return (
    <>
      <SectionHeader>Sign Up</SectionHeader>
      <StandardMainContainer>
        <div className='h-full w-full flex justify-center'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='w-1/2 h-fit grid grid-cols-4 gap-y-4'
          >
            <label className='col-span-2' htmlFor='sign-up-username'>
              Username:
            </label>
            <input
              className='col-span-2 text-gray-800'
              id='sign-up-username'
              type='text'
              {...register('username')}
            ></input>
            <label className='col-span-2' htmlFor='sign-up-password'>
              Password:
            </label>
            <input
              className='col-span-2 text-gray-800'
              id='sign-up-password'
              type='password'
              {...register('password')}
            ></input>
            <label className='col-span-2' htmlFor='sign-up-cfm-password'>
              Re-enter Password:
            </label>
            <input
              className='col-span-2 text-gray-800'
              id='sign-up-cfm-password'
              type='password'
              {...register('confirmPassword')}
            ></input>
            <button
              className='border border-gray-400 rounded-md py-2 px-4'
              type='submit'
            >
              Complete Signup
            </button>
          </form>
        </div>
      </StandardMainContainer>
    </>
  );
}
