import { Fragment, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { RequestStatus } from '@zoonk/models';
import { reportEdit } from '@zoonk/services';
import ModalConfirmation from './ModalConfirmation';
import ModalError from './ModalError';
import ModalProgress from './ModalProgress';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface EditsReportProps {
  id: string;
}

const EditsReport = ({ id }: EditsReportProps) => {
  const translate = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<string>('');
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) setStatus('error');
  }, [error]);

  const report = () => {
    setStatus('loading');
    reportEdit(id, comments, user || null)
      .then(() => setStatus('success'))
      .catch((e) => setError(e.message));
  };

  return (
    <Fragment>
      <Tooltip title={translate('report_tooltip')}>
        <Button size="small" color="secondary" onClick={() => setOpen(true)}>
          {translate('report')}
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-describedby="dialog-report"
      >
        <DialogContent>
          {status === 'idle' && (
            <Fragment>
              <DialogContentText id="dialog-report">
                {translate('report_confirmation')}
              </DialogContentText>

              <TextField
                autoFocus
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                margin="dense"
                id="comments"
                label={translate('comments')}
                type="text"
                fullWidth
              />
            </Fragment>
          )}

          {status === 'loading' && (
            <ModalProgress title={translate('report_progress')} />
          )}

          {status === 'success' && (
            <ModalConfirmation
              msg={translate('report_success')}
              onReturn={() => setOpen(false)}
            />
          )}

          {status === 'error' && (
            <ModalError msg={error} onReturn={() => setStatus('idle')} />
          )}
        </DialogContent>

        {status === 'idle' && (
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              {translate('cancel')}
            </Button>
            <Button onClick={report} color="primary">
              {translate('confirm')}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Fragment>
  );
};

export default EditsReport;
