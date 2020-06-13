import { useContext } from 'react';
import { GlobalContext } from '@zoonk/utils';

const useTranslation = () => {
  const { translate } = useContext(GlobalContext);
  return translate;
};

export default useTranslation;
