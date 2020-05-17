/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { LinearProgress } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import ErrorBoundary from '@zoonk/components/ErrorBoundary';
import Navbar from '@zoonk/components/Navbar';
import { TranslationFn, User } from '@zoonk/models';
import { logIPAddress } from '@zoonk/services';
import {
  auth,
  analytics,
  appLanguage,
  db,
  GlobalContext,
  isProduction,
  performance,
  theme,
} from '@zoonk/utils';

let translation: TranslationFn = require('../locale/en').default;

if (appLanguage === 'pt') {
  translation = require('../locale/pt').default;
}

auth.languageCode = appLanguage;

const CustomApp = ({ Component, pageProps }: AppProps) => {
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
          setUserData({
            ...fbUser,
            email: user.email,
            uid: user.uid,
          });

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

  useEffect(() => {
    performance();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Zoonk</title>
      </Head>

      <GlobalContext.Provider
        value={{
          translate: translation,
          profile: userData
            ? {
                bio: userData.bio,
                name: userData.name,
                photo: userData.photo,
                username: userData.username,
                facebook: userData.facebook,
                github: userData.github,
                instagram: userData.instagram,
                linkedin: userData.linkedin,
                twitter: userData.twitter,
                web: userData.web,
                youtube: userData.youtube,
              }
            : null,
          user: userData,
        }}
      >
        {user === undefined && <LinearProgress variant="query" />}

        <Navbar />
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </GlobalContext.Provider>
    </ThemeProvider>
  );
};

export default CustomApp;
