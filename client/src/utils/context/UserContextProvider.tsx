import React, { useEffect, useState, createContext } from 'react';
import { AuthenticateUserInput } from '../../../../api-server/validators/authenticateUserValidator';
import { trpc } from '../trpc/trpc';
import { NewUserInput } from '../../../../api-server/validators/newUserFormValidator';

const initialUserState = {
  username: null,
  isLoggedIn: false,
  login: null,
  logout: null,
  createUser: null,
};

type UserContextType = {
  username: string | null;
  isLoggedIn: boolean;
  login:
    | (({ username, password }: { username: string; password: string }) => void)
    | null;
  logout: (() => void) | null;
  createUser: ((input: NewUserInput) => void) | null;
};

export const UserContext = createContext<UserContextType>(initialUserState);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userContext, setUserContext] =
    useState<UserContextType>(initialUserState);

  const authenticateUser = trpc.users.authenticateUser.useMutation({
    onSuccess(data, ctx) {
      localStorage.setItem('token', data);
      setUserContext((prev) => ({
        ...prev,
        username: ctx.username,
        isLoggedIn: true,
      }));
    },
  });

  useEffect(() => {
    setUserContext((prev) => ({ ...prev, login, logout, createUser }));
  }, []);

  const utils = trpc.useContext();

  function login({ username, password }: AuthenticateUserInput) {
    authenticateUser.mutate({ username, password });
  }

  function logout() {
    localStorage.removeItem('token');
    utils.users.invalidate();
    setUserContext(initialUserState);
  }

  const newUserMutation = trpc.users.create.useMutation({
    onSuccess(res) {
      localStorage.setItem('token', res.token);
      setUserContext((prev) => ({
        ...prev,
        isLoggedIn: true,
        username: res.user.username,
      }));
    },
  });

  function createUser(input: NewUserInput) {
    if (userContext.isLoggedIn) return;
    newUserMutation.mutate(input);
  }

  // on initial render, check for token
  const user = trpc.users.validateToken.useQuery(undefined, {
    enabled: !userContext.isLoggedIn && !!localStorage.getItem('token'),
  });

  useEffect(() => {
    if (!user.isLoading && !user.isError) {
      console.log('auto logged-in');
      setUserContext((prev) => ({
        ...prev,
        isLoggedIn: true,
        username: user.data!,
      }));
    }
  }, [user.data]);

  return (
    <UserContext.Provider value={{ ...userContext }}>
      {children}
    </UserContext.Provider>
  );
}
