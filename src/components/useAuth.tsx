import { useContext } from 'react';
import { AuthState } from '@zoonk/models';
import { AuthContext } from '@zoonk/utils';

const useAuth = (): AuthState => {
  const { profile, user } = useContext(AuthContext);
  return { profile, user };
};

export default useAuth;
