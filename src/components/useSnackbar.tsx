import { useContext, useEffect, useState } from 'react';
import { SnackbarAction } from '@zoonk/models';
import { GlobalContext, logError } from '@zoonk/utils';

const useSnackbar = () => {
  const { snackbar, translate } = useContext(GlobalContext);
  const [action, setAction] = useState<SnackbarAction>();
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    const defaultMessage = (type: SnackbarAction): string | undefined => {
      switch (type) {
        case 'dismiss':
          return undefined;
        case 'error':
          return translate('error_action');
        case 'progress':
          return translate('saving');
        case 'success':
          return translate('saved');
        default:
          return undefined;
      }
    };

    const handler = (type: SnackbarAction, msg?: string) => {
      setAction(type);
      setMessage(msg || defaultMessage(type));
      if (type === 'error' && msg) logError(msg);
    };

    snackbar.on('*', handler);
    return () => snackbar.off('*', handler);
  }, [snackbar, translate]);

  return { snackbar: snackbar.emit, action, message };
};

export default useSnackbar;
