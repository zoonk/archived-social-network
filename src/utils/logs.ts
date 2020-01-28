import { SnackbarAction } from '@zoonk/models';

/**
 * Default logging data for when a Firebase request
 * returns an error. This is used in `catch` statements
 * for dispatching a `setSnackbar` action.
 */
export const firebaseError = (
  err: firebase.FirebaseError,
  action: string,
): SnackbarAction => {
  return {
    type: 'error',
    msg: err.message,
    log: {
      code: err.code,
      description: action,
    },
  };
};
