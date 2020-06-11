/* eslint-disable global-require */
import React, { Fragment } from 'react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import Navbar from '@zoonk/components/Navbar';
import { TranslationFn } from '@zoonk/models';
import { appLanguage, GlobalContext, theme } from '@zoonk/utils';
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

/**
 * Include the auth provider on client-side only.
 */
const AppWrapper = ({ children }: AppWrapperProps) => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return <Fragment>{children}</Fragment>;
  }

  return <Auth>{children}</Auth>;
};

const CustomApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Zoonk</title>
      </Head>

      <AppWrapper>
        <GlobalContext.Provider value={{ translate: translation }}>
          <Navbar />
          <Component {...pageProps} />
        </GlobalContext.Provider>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default CustomApp;
