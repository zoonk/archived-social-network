/* eslint-disable global-require */
import React, { useState } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from '@zoonk/components/Navbar';
import { Profile, TranslationFn, User } from '@zoonk/models';
import { appLanguage, AuthContext, GlobalContext, theme } from '@zoonk/utils';
import '../quill.css';
import '../styles.css';

const Auth = dynamic(() => import('@zoonk/components/Auth'), { ssr: false });

let translation: TranslationFn = require('../locale/en').default;

if (appLanguage === 'pt') {
  translation = require('../locale/pt').default;
}

interface AppWrapperProps {
  children: React.ReactNode;
}

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const [user, setUser] = useState<User.Get | null | undefined>(undefined);
  const [profile, setProfile] = useState<Profile.Get | null>(null);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Zoonk</title>
      </Head>

      <AuthContext.Provider value={{ profile, user, setProfile, setUser }}>
        <GlobalContext.Provider value={{ translate: translation }}>
          <Auth />
          <Navbar />
          <Component {...pageProps} />
        </GlobalContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};

export default CustomApp;
