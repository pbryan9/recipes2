import React, { useEffect, useState, createContext } from 'react';
import { AuthenticateUserInput } from '../../../../api-server/validators/authenticateUserValidator';
import { trpc } from '../trpc/trpc';
import { NewUserInput } from '../../../../api-server/validators/newUserFormValidator';
import { RecoverPasswordInput } from '../../../../api-server/validators/recoverPasswordValidator';
import { ResetPasswordInput } from '../../../../api-server/validators/resetPasswordValidator';

const initialUserState: UserContext = {
  username: null,
  avatarColor: '#3A4D00',
  isLoggedIn: false,
  isLoading: true,
  favorites: [],
  login: () => null,
  logout: () => null,
  createUser: () => null,
  addToFavorites: () => null,
  removeFromFavorites: () => null,
  changeAvatarColor: () => null,
  requestRecoveryCode: () => null,
  attemptPasswordRecovery: () => null,
  resetPassword: () => null,
};

type UserContext = {
  username: string | null;
  avatarColor: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  favorites: string[];
  login: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => void;
  logout: () => void;
  createUser: (input: NewUserInput) => void;
  addToFavorites: (recipeId: string) => void;
  removeFromFavorites: (recipeId: string) => void;
  changeAvatarColor: (colorCode: string) => void;
  requestRecoveryCode: (email: string) => void;
  attemptPasswordRecovery: (input: RecoverPasswordInput) => void;
  resetPassword: (input: ResetPasswordInput) => void;
};

export const UserContext = createContext<UserContext>(initialUserState);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userContext, setUserContext] = useState<UserContext>(initialUserState);
  const utils = trpc.useContext();

  // on initial render, check for token
  const tokenCheck = trpc.users.validateToken.useQuery(undefined, {
    enabled: !userContext.isLoggedIn && !!localStorage.getItem('token'),
  });

  const userInfo = trpc.users.getUserInfo.useQuery(undefined, {
    enabled: userContext.isLoggedIn,
    staleTime: 1000 * 60 * 1,
  });

  const newUserMutation = trpc.users.create.useMutation({
    onSuccess(res) {
      localStorage.setItem('token', res.token);
      setUserContext((prev) => ({
        ...prev,
        isLoggedIn: true,
        username: res.user.username,
        isLoading: false,
      }));
    },
  });

  const authenticateUserMutation = trpc.users.authenticateUser.useMutation({
    onSuccess(data, ctx) {
      localStorage.setItem('token', data);
      setUserContext((prev) => ({
        ...prev,
        username: ctx.username,
        isLoggedIn: true,
      }));
    },
    onSettled() {
      setUserContext((prev) => ({ ...prev, isLoading: false }));
    },
  });

  const addToFavoritesMutation = trpc.users.addToFavorites.useMutation({
    onSuccess(_, { recipeId }) {
      setUserContext((prev) => ({
        ...prev,
        favorites: [...prev.favorites, recipeId],
      }));
      utils.users.getUserInfo.invalidate();
      utils.users.getUserInfo.refetch();
    },
  });

  const removeFromFavoritesMutation =
    trpc.users.removeFromFavorites.useMutation({
      onSuccess() {
        utils.users.getUserInfo.invalidate();
        utils.users.getUserInfo.refetch();
      },
    });

  const changeAvatarColorMutation = trpc.users.changeAvatarColor.useMutation({
    onSuccess(_, { colorCode }) {
      setUserContext((prev) => ({
        ...prev,
        avatarColor: colorCode,
      }));

      utils.recipes.all.refetch();
    },
  });

  const requestRecoveryCodeMutation =
    trpc.users.requestRecoveryCode.useMutation({
      onSuccess() {
        console.log('ok did it');
      },
    });

  const attemptPasswordRecoveryMutation =
    trpc.users.attemptPasswordRecovery.useMutation({
      onSuccess(data) {
        localStorage.setItem('token', data);
        console.log({ data, message: 'password reset' });
      },
    });

  // TODO: resume here setting up resetPassword function
  const resetPasswordMutation = trpc.users.resetPassword.useMutation({
    onSuccess(data) {
      localStorage.setItem('token', data);
      console.log({ message: 'password reset successful' });
    },
  });

  useEffect(() => {
    setUserContext((prev) => ({
      ...prev,
      isLoading: authenticateUserMutation.isLoading,
    }));
  }, [authenticateUserMutation.isLoading]);

  function login({ username, password }: AuthenticateUserInput) {
    authenticateUserMutation.mutate({ username, password });
  }

  function createUser(input: NewUserInput) {
    if (userContext.isLoggedIn) return;
    newUserMutation.mutate(input);
  }

  function logout() {
    // * remember to add any new functions here so they're not removed on logout
    localStorage.removeItem('token');
    utils.users.getUserInfo.cancel(undefined, { silent: true });
    userInfo.remove();
    utils.users.invalidate();
    setUserContext((prev) => ({
      ...initialUserState,
      isLoading: false,
      login: prev.login,
      logout: prev.logout,
      createUser: prev.createUser,
      addToFavorites: prev.addToFavorites,
      removeFromFavorites: prev.removeFromFavorites,
    }));
  }

  function addToFavorites(recipeId: string) {
    // optimistically add recipe to favorites
    setUserContext((prev) => ({
      ...prev,
      favorites: [...prev.favorites, recipeId],
    }));
    addToFavoritesMutation.mutate({ recipeId });
  }

  function removeFromFavorites(recipeId: string) {
    // optimistically remove recipe from favorites
    setUserContext((prev) => ({
      ...prev,
      favorites: prev.favorites.filter((id) => id !== recipeId),
    }));
    removeFromFavoritesMutation.mutate({ recipeId });
  }

  function changeAvatarColor(colorCode: string) {
    changeAvatarColorMutation.mutate({ colorCode });
  }

  function requestRecoveryCode(email: string) {
    requestRecoveryCodeMutation.mutate({ email });
  }

  function attemptPasswordRecovery(input: RecoverPasswordInput) {
    attemptPasswordRecoveryMutation.mutate(input);
  }

  /**
   *
   * Set up user management functions
   *
   */

  useEffect(() => {
    setUserContext((prev) => ({
      ...prev,
      login,
      logout,
      createUser,
      addToFavorites,
      removeFromFavorites,
      changeAvatarColor,
      requestRecoveryCode,
      attemptPasswordRecovery,
    }));
  }, []);

  useEffect(() => {
    if (!tokenCheck.isLoading && !tokenCheck.isError) {
      setUserContext((prev) => ({
        ...prev,
        isLoggedIn: true,
        username: tokenCheck.data!,
        isLoading: false,
      }));
    }
  }, [tokenCheck.data, tokenCheck.isLoading]);

  useEffect(() => {
    if (userInfo.isSuccess) {
      setUserContext((prev) => ({
        ...prev,
        avatarColor: userInfo.data.avatarColor || initialUserState.avatarColor,
        favorites: userInfo.data.favorites.map(({ id }) => id),
      }));
    }
  }, [userInfo.isSuccess, userInfo.isLoading]);

  return (
    <UserContext.Provider value={{ ...userContext }}>
      {children}
    </UserContext.Provider>
  );
}
