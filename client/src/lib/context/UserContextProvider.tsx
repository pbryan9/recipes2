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
  isLoading: false,
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
  clearError: () => null,
  error: {},
};

type UserErrorItem = string;

type UserError = Partial<
  Record<Exclude<keyof UserContext, 'error'>, UserErrorItem>
>;

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
  requestRecoveryCode: (email: string, cb?: () => void) => void;
  attemptPasswordRecovery: (
    input: RecoverPasswordInput,
    successCallback?: () => void
  ) => void;
  resetPassword: (input: ResetPasswordInput, cb?: () => void) => void;
  clearError: (path: keyof UserError) => void;
  error: UserError;
};

export const UserContext = createContext<UserContext>(initialUserState);

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userContext, setUserContext] = useState<UserContext>(initialUserState);

  /**
   * TRPC setup
   */

  const utils = trpc.useContext();

  // on initial render, check for token
  const tokenCheck = trpc.users.validateToken.useQuery(undefined, {
    enabled: !userContext.isLoggedIn && !!localStorage.getItem('token'),
  });

  const userInfo = trpc.users.getUserInfo.useQuery(undefined, {
    enabled: userContext.isLoggedIn,
    staleTime: 1000 * 60 * 1,
  });

  useEffect(() => {
    if (tokenCheck.isFetching || userInfo.isFetching) {
      startLoading();
    } else {
      finishLoading();
    }
  }, [tokenCheck.isFetching, userInfo.isFetching]);

  const newUserMutation = trpc.users.create.useMutation({
    onSuccess(res) {
      localStorage.setItem('token', res.token);
      setUserContext((prev) => ({
        ...prev,
        isLoggedIn: true,
        username: res.user.username,
      }));
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
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
      clearError('login');
    },
    onError(err) {
      addErrorToContext(err.message, 'login');
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
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
      clearError('addToFavorites');
    },
    onError(err) {
      addErrorToContext(err.message, 'addToFavorites');
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
    },
  });

  const removeFromFavoritesMutation =
    trpc.users.removeFromFavorites.useMutation({
      onSuccess() {
        utils.users.getUserInfo.invalidate();
        utils.users.getUserInfo.refetch();
        clearError('removeFromFavorites');
      },
      onError(err) {
        addErrorToContext(err.message, 'removeFromFavorites');
      },
      onMutate() {
        startLoading();
      },
      onSettled() {
        finishLoading();
      },
    });

  const changeAvatarColorMutation = trpc.users.changeAvatarColor.useMutation({
    onSuccess(_, { colorCode }) {
      setUserContext((prev) => ({
        ...prev,
        avatarColor: colorCode,
      }));

      utils.recipes.all.refetch();
      clearError('changeAvatarColor');
    },
    onError(err) {
      addErrorToContext(err.message, 'changeAvatarColor');
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
    },
  });

  const requestRecoveryCodeMutation =
    trpc.users.requestRecoveryCode.useMutation({
      onMutate() {
        startLoading();
      },
      onSuccess() {
        clearError('requestRecoveryCode');
      },
      onError(err) {
        addErrorToContext(err.message, 'requestRecoveryCode');
      },
      onSettled() {
        finishLoading();
      },
    });

  function addErrorToContext(errMessage: string, path: keyof UserError) {
    setUserContext((prev) => ({
      ...prev,
      error: {
        ...prev.error,
        [path]: errMessage,
      },
    }));
  }

  function clearError(path: keyof UserError) {
    let newErrorContext = userContext.error;
    delete newErrorContext[path];

    setUserContext((prev) => ({ ...prev, error: newErrorContext }));
  }

  const attemptPasswordRecoveryMutation =
    trpc.users.attemptPasswordRecovery.useMutation({
      onSuccess(data) {
        localStorage.setItem('token', data);
        clearError('attemptPasswordRecovery');
      },
      onMutate() {
        startLoading();
      },
      onSettled() {
        finishLoading();
      },
      onError(err) {
        addErrorToContext(err.message, 'attemptPasswordRecovery');
      },
    });

  const resetPasswordMutation = trpc.users.resetPassword.useMutation({
    onSuccess(data) {
      localStorage.setItem('token', data);
      clearError('resetPassword');
    },
    onError(err) {
      addErrorToContext(err.message, 'resetPassword');
    },
    onMutate() {
      startLoading();
    },
    onSettled() {
      finishLoading();
    },
  });

  /**
   * Define user functions
   */

  const userContextFunctions = {
    login,
    logout,
    createUser,
    addToFavorites,
    removeFromFavorites,
    changeAvatarColor,
    requestRecoveryCode,
    attemptPasswordRecovery,
    resetPassword,
    clearError,
  };

  function startLoading() {
    setUserContext((prev) => ({ ...prev, isLoading: true }));
  }

  function finishLoading() {
    setUserContext((prev) => ({ ...prev, isLoading: false }));
  }

  function login({ username, password }: AuthenticateUserInput) {
    authenticateUserMutation.mutate({ username, password });
  }

  function createUser(input: NewUserInput) {
    if (userContext.isLoggedIn) return;
    newUserMutation.mutate(input);
  }

  function logout() {
    localStorage.removeItem('token');
    utils.users.getUserInfo.cancel(undefined, { silent: true });
    userInfo.remove();
    tokenCheck.remove();
    utils.users.invalidate();

    setUserContext({
      ...initialUserState,
      ...userContextFunctions,
    });
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

  function requestRecoveryCode(email: string, cb?: () => void) {
    requestRecoveryCodeMutation.mutate(
      { email },
      {
        onSuccess() {
          if (cb) cb();
        },
      }
    );
  }

  function attemptPasswordRecovery(
    input: RecoverPasswordInput,
    successCallback?: () => void
  ) {
    attemptPasswordRecoveryMutation.mutate(input, {
      onSuccess: successCallback,
    });
  }

  function resetPassword(input: ResetPasswordInput, cb?: () => void) {
    resetPasswordMutation.mutate(input, {
      onSuccess() {
        if (cb) cb();
      },
    });
  }

  /**
   * Set up user management functions
   */

  useEffect(() => {
    setUserContext((prev) => ({
      ...prev,
      ...userContextFunctions,
    }));
  }, []);

  useEffect(() => {
    // if (!tokenCheck.isLoading && !tokenCheck.isError) {
    if (tokenCheck.isSuccess) {
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
