import { TranslationFn } from './i18n';
import { Profile } from './profile';
import { User } from './user';

export interface GlobalState {
  translate: TranslationFn;
}

export interface AuthState {
  profile: Profile.Get | null;
  user: User.Get | null | undefined;
  setProfile: React.Dispatch<React.SetStateAction<Profile.Get | null>>;
  setUser: React.Dispatch<React.SetStateAction<User.Get | null | undefined>>;
}

export interface UserState {
  xp: number;
}
