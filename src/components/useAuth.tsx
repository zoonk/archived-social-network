import { useContext } from 'react';
import { AuthState } from '@zoonk/models/context';
import { AuthContext } from '@zoonk/utils';

const useAuth = (): Omit<AuthState, 'setProfile' | 'setUser'> => {
  const { profile, user } = useContext(AuthContext);
  return { profile, user };
};

export default useAuth;
