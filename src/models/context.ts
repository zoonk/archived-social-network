import { TranslationFn } from './i18n';
import { Profile } from './profile';
import { User } from './user';

export interface GlobalState {
  translate: TranslationFn;
  profile: Profile.Get | null;
  user: User.Get | null | undefined;
}

export interface UserState {
  xp: number;
}
