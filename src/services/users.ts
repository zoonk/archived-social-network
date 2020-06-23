import firebase from '@zoonk/firebase';
import { auth } from '@zoonk/firebase/auth';
import { db } from '@zoonk/firebase/db';
import { functions } from '@zoonk/firebase/functions';
import { Notification, User } from '@zoonk/models';
import { logSignIn, logSignUp } from '@zoonk/utils';

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
  logSignIn('email');
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
  logSignIn('facebook');
  return auth.signInWithPopup(provider);
};

/**
 * Google authentication.
 */
export const signInWithGoogle = (): Promise<firebase.auth.UserCredential> => {
  const provider = new firebase.auth.GoogleAuthProvider();
  logSignIn('google');
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
  logSignUp('email');
  return auth.signInWithEmailAndPassword(email, password);
};
