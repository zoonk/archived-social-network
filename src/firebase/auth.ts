import { appLanguage } from '@zoonk/utils';
import firebase from './index';
import 'firebase/auth';

export const auth = firebase.auth();
auth.languageCode = appLanguage;
