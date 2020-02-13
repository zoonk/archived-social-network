import { UILanguage } from '@zoonk/models';

const envLang = process.env.APP_LANG as UILanguage | undefined;
export const isProduction = process.env.BUILD_ENV === 'production';
export const appLanguage: UILanguage = envLang || 'en';
export const maxFileSize = 2097152;
export const maxLessons = 10;
export const maxSavedItems = 20;
export const imgSize = '390x250px';

export const rootUrl = `https://${appLanguage}.zoonk.org`;

// eslint-disable-next-line max-len
export const socialIcon =
  'https://firebasestorage.googleapis.com/v0/b/zoonk-production.appspot.com/o/core%2Fzoonk-icon.png?alt=media&token=bc80c6eb-d36c-4f6a-b186-f228bdb9688f';
