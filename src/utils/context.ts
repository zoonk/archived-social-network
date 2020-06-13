import { createContext } from 'react';
import { Post } from '@zoonk/models';
import { AuthState, GlobalState, UserState } from '@zoonk/models/context';
import { SnackbarEmitter } from './snackbar';

/**
 * This context is available throughout the whole app.
 */
export const GlobalContext = createContext<GlobalState>({
  snackbar: SnackbarEmitter,
  translate: () => '',
});

export const AuthContext = createContext<AuthState>({
  profile: null,

  /**
   * Keeping the user 'undefined' at the beginning helps us
   * to check if a user is logged in or not as the authState
   * received from Firebase is 'null' when a user is not logged in.
   *
   * E.g.
   * user === undefined means we didn't get the authState yet;
   * user === null means this user is not logged in;
   * user.isTruthy means the user is logged in and we received its data.
   */
  user: undefined,
  setProfile: () => {},
  setUser: () => {},
});

export const UserContext = createContext<UserState>({
  xp: 1,
});

export const PostContext = createContext<Post.Get>({} as Post.Get);
