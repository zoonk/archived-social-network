import { UILanguage } from '@zoonk/models';

const envLang = process.env.NEXT_PUBLIC_APP_LANG as UILanguage | undefined;
export const isProduction = process.env.NEXT_PUBLIC_BUILD_ENV === 'production';
export const appLanguage: UILanguage = envLang || 'en';
export const maxFileSize = 2097152;
export const imgSize = '390x250px';

export const rootUrl = `https://${appLanguage}.zoonk.org`;

export const getAboutId = () => {
  switch (appLanguage) {
    case 'en':
      return 'zoonk';
    case 'pt':
      return 'zoonk-brasil';
    default:
      return 'zoonk';
  }
};

// eslint-disable-next-line max-len
export const socialIcon =
  'https://firebasestorage.googleapis.com/v0/b/zoonk-production.appspot.com/o/core%2Ficon-192.png?alt=media&token=7bcaa482-06e3-4944-8fac-7e07682c4121';
