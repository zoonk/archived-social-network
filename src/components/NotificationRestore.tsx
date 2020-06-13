import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import { RequestStatus } from '@zoonk/models';
import { restoreItem } from '@zoonk/services';
import ModalConfirmation from './ModalConfirmation';
import ModalError from './ModalError';
import ModalProgress from './ModalProgress';
import useTranslation from './useTranslation';

interface NotificationRestoreProps {
  id: string;
}

/**
 * Restore a deleted item.
 */
const NotificationRestore = ({ id }: NotificationRestoreProps) => {
  const translate = useTranslation();
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setStatus('error');
  }, [error]);

  // Restore a recently deleted item.
  const restore = () => {
    setStatus('loading');
    restoreItem(id)
      .then(() => setStatus('success'))
      .catch((e) => setError(e.message));
  };

  return (
    <Fragment>
      <Button size="small" color="primary" onClick={() => setOpen(true)}>
        {translate('revert')}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {status === 'idle' && (
            <DialogContentText>
              {translate('revert_confirmation')}
            </DialogContentText>
          )}

          {status === 'loading' && (
            <ModalProgress title={translate('revert_progress')} />
          )}

          {status === 'success' && (
            <ModalConfirmation
              msg={translate('revert_success')}
              onReturn={() => setOpen(false)}
            />
          )}

          {status === 'error' && (
            <ModalError msg={error} onReturn={() => setOpen(false)} />
          )}
        </DialogContent>

        {status === 'idle' && (
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              {translate('cancel')}
            </Button>
            <Button onClick={restore} color="primary">
              {translate('confirm')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  );
};

export default NotificationRestore;
