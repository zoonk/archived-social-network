import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Tooltip,
} from '@material-ui/core';
import { Activity, RequestStatus } from '@zoonk/models';
import { deleteActivity, restoreItem, revertChanges } from '@zoonk/services';
import ModalConfirmation from './ModalConfirmation';
import ModalError from './ModalError';
import ModalProgress from './ModalProgress';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface EditsRevertProps {
  edits: Activity.Get;
}

const EditsRevert = ({ edits }: EditsRevertProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setStatus('error');
  }, [error]);

  if (!user || !profile) {
    return null;
  }

  // Remove a recently created item.
  const remove = () => {
    deleteActivity(edits, profile, user.uid)
      .then(() => setStatus('success'))
      .catch((e) => setError(e.message));
  };

  // Rollback to previous changes made to an item.
  const revert = () => {
    revertChanges(edits, profile, user.uid)
      .then(() => setStatus('success'))
      .catch((e) => setError(e.message));
  };

  // Restore a recently deleted item.
  const restore = () => {
    restoreItem(edits.id)
      .then(() => setStatus('success'))
      .catch((e) => setError(e.message));
  };

  const handleRevert = () => {
    setStatus('loading');
    if (edits.action === 'created') remove();
    if (edits.action === 'updated') revert();
    if (edits.action === 'deleted') restore();
  };

  return (
    <Fragment>
      <Tooltip title={translate('revert_tooltip')}>
        <div>
          <Button
            size="small"
            color="primary"
            disabled={edits.action === 'created' && edits.category === 'topics'}
            onClick={() => setOpen(true)}
          >
            {translate('revert')}
          </Button>
        </div>
      </Tooltip>

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
            <Button onClick={handleRevert} color="primary">
              {translate('confirm')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  );
};

export default EditsRevert;
