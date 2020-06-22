/* eslint-disable global-require */
import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from '@zoonk/components/Navbar';
import Snackbar from '@zoonk/components/Snackbar';
import { Profile, TranslationFn, User } from '@zoonk/models';
import {
  appLanguage,
  AuthContext,
  GlobalContext,
  SnackbarEmitter,
  theme,
} from '@zoonk/utils';
import '../styles.css';

const Auth = dynamic(() => import('@zoonk/components/Auth'), { ssr: false });

let translation: TranslationFn = require('../locale/en').default;

if (appLanguage === 'pt') {
  translation = require('../locale/pt').default;
}

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<User.Get | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile.Get | null>(null);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Zoonk</title>
      </Head>

      <AuthContext.Provider value={{ profile, user, setProfile, setUser }}>
        <GlobalContext.Provider
          value={{ snackbar: SnackbarEmitter, translate: translation }}
        >
          <Auth />
          <Navbar />
          <Component {...pageProps} />
          <Snackbar />
        </GlobalContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default CustomApp;
