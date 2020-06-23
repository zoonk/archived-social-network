import { useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { auth } from '@zoonk/firebase/auth';
import { db } from '@zoonk/firebase/db';
import { performance } from '@zoonk/firebase/performance';
import { User } from '@zoonk/models';
import { logIPAddress } from '@zoonk/services/users';
import { AuthContext, pageview } from '@zoonk/utils';

const Auth = () => {
  const { user, setProfile, setUser } = useContext(AuthContext);
  const [authState, setAuthState] = useState<firebase.User | null | undefined>(
    undefined,
  );

  // Observe the authentication state coming from Firebase and add it to the local state.
  useEffect(() => {
    auth.onAuthStateChanged(setAuthState);
  }, []);

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (authState) {
      // Get the current user settings from the database.
      unsubscribe = db.doc(`users/${authState.uid}`).onSnapshot((snap) => {
        if (snap && snap.data()) {
          const fbUser = snap.data() as User.Response;

          // Store the user data to be saved in the AuthContext.
          setUser({ ...fbUser, uid: authState.uid });
        }
      });
    }

    // It type-checks for 'null' because that's the result coming from Firebase
    // when the user isn't logged in. If the user is 'undefined', then it means
    // we don't know the authentication state yet.
    if (authState === null) {
      setUser(null);
    }

    return () => {
      unsubscribe();
    };
  }, [authState, setProfile, setUser]);

  // Update profile.
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }

    setProfile({
      bio: user.bio,
      id: user.uid,
      name: user.name,
      photo: user.photo,
      username: user.username,
      facebook: user.facebook || null,
      github: user.github || null,
      instagram: user.instagram || null,
      linkedin: user.linkedin || null,
      twitter: user.twitter || null,
      web: user.web || null,
      youtube: user.youtube || null,
    });
  }, [setProfile, user]);

  /**
   * To help us prevent vandalism, we log a user's IP address
   * when they are logged in. This way, we can block their
   * IP address in case of multiple violations.
   */
  useEffect(() => {
    if (authState) {
      logIPAddress();
    }
  }, [authState]);

  useEffect(() => {
    performance();
  }, []);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // Don't log data when the user is an admin.
      if (user?.role === 'admin') return;
      pageview(url, user?.uid);
    };

    Router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [user]);

  return null;
};

export default Auth;
