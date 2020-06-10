import React, { useEffect, useState } from 'react';
import { analytics } from '@zoonk/firebase/analytics';
import { auth } from '@zoonk/firebase/auth';
import { db } from '@zoonk/firebase/db';
import { User } from '@zoonk/models';
import { logIPAddress } from '@zoonk/services/users';
import { AuthContext, appLanguage, isProduction } from '@zoonk/utils';

interface AuthProps {
  children: React.ReactNode;
}

const Auth = ({ children }: AuthProps) => {
  const [user, setUser] = useState<firebase.User | null | undefined>(undefined);
  const [userData, setUserData] = useState<User.Get | null | undefined>(
    undefined,
  );

  // Observe the authentication state coming from Firebase and add it to the local state.
  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (user) {
      // Get the current user settings from the database.
      unsubscribe = db.doc(`users/${user.uid}`).onSnapshot((snap) => {
        if (snap && snap.data()) {
          const fbUser = snap.data() as User.Response;

          // Store the user data to be saved in the GlobalContext.
          setUserData({ ...fbUser, uid: user.uid });

          // Disable analytics for admins.
          analytics().setAnalyticsCollectionEnabled(fbUser.role !== 'admin');
          analytics().setUserProperties({
            emailVerified: user.emailVerified,
            role: fbUser.role,
            appLanguage,
          });
          analytics().setUserId(user.uid);
        }
      });
    }

    // It type-checks for 'null' because that's the result coming from Firebase
    // when the user isn't logged in. If the user is 'undefined', then it means
    // we don't know the authentication state yet.
    if (user === null) {
      setUserData(null);
    }

    return () => {
      unsubscribe();
    };
  }, [user]);

  /**
   * To help us prevent vandalism, we log a user's IP address
   * when they are logged in. This way, we can block their
   * IP address in case of multiple violations.
   */
  useEffect(() => {
    if (user && isProduction) {
      logIPAddress();
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        profile: userData
          ? {
              bio: userData.bio,
              id: userData.uid,
              name: userData.name,
              photo: userData.photo,
              username: userData.username,
              facebook: userData.facebook || null,
              github: userData.github || null,
              instagram: userData.instagram || null,
              linkedin: userData.linkedin || null,
              twitter: userData.twitter || null,
              web: userData.web || null,
              youtube: userData.youtube || null,
            }
          : null,
        user: userData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default Auth;
