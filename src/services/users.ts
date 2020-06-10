import { Notification, User } from '@zoonk/models';
import { analytics, db, functions } from '@zoonk/utils';
import firebase from '@zoonk/utils/firebase';
import 'firebase/auth';

const auth = firebase.auth();

/**
 * Log a user's IP address to the database.
 */
export const logIPAddress = async (): Promise<firebase.functions.HttpsCallableResult> => {
  return functions.httpsCallable('logIPAddress')();
};

/**
 * Email/password authentication.
 */
export const signIn = (
  email: string,
  password: string,
): Promise<firebase.auth.UserCredential> => {
  analytics().logEvent('login', { method: 'password' });
  return auth.signInWithEmailAndPassword(email, password);
};

export const signOut = () => {
  return auth.signOut();
};

/**
 * Facebook authentication.
 */
export const signInWithFacebook = (): Promise<firebase.auth.UserCredential> => {
  const provider = new firebase.auth.FacebookAuthProvider();
  analytics().logEvent('login', { method: 'facebook' });
  return auth.signInWithPopup(provider);
};

/**
 * Google authentication.
 */
export const signInWithGoogle = (): Promise<firebase.auth.UserCredential> => {
  const provider = new firebase.auth.GoogleAuthProvider();
  analytics().logEvent('login', { method: 'google' });
  return auth.signInWithPopup(provider);
};

/**
 * Update a user's password.
 */
export const updatePassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  const { currentUser } = auth;

  if (!currentUser) {
    throw new Error('user_not_loggedin');
  }

  const credential = firebase.auth.EmailAuthProvider.credential(
    String(currentUser.email),
    oldPassword,
  );

  await currentUser.reauthenticateWithCredential(credential);
  return currentUser.updatePassword(newPassword);
};

export const updateNotificationSettings = async (
  userId: string,
  field: Notification.Type,
  active: User.NotificationType[],
) => {
  const changes = { [`notificationSettings.${field}`]: active };
  return db.doc(`users/${userId}`).update(changes);
};

export const resetPassword = async (email: string) => {
  return auth.sendPasswordResetEmail(email);
};

export const signUp = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};
