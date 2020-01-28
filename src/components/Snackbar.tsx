import { useEffect, useState } from 'react';
import {
  IconButton,
  makeStyles,
  Snackbar,
  SnackbarContent,
  Theme,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Close } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { analytics, errorTimeout, successTimeout } from '@zoonk/utils';

interface SnackbarProps {
  action: SnackbarAction | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  progress: {
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

/**
 * Display a snackbar and log events in our analytics server
 * when you pass a `log` value to the action prop.
 */
const CustomSnackbar = ({ action }: SnackbarProps) => {
  const classes = useStyles();
  const [duration, setDuration] = useState<number | null>(null);
  const [message, setMessage] = useState<string>();

  useEffect(() => {
    if (action?.type === 'error') setDuration(errorTimeout);
    if (action?.type === 'success') setDuration(successTimeout);
    if (!action) setDuration(null);
  }, [action]);

  useEffect(() => {
    setMessage(action?.msg);
  }, [action]);

  useEffect(() => {
    if (action?.type === 'error' && action.log) {
      analytics().logEvent('exception', {
        ...action.log.opts,
        description: action.log.description,
        msg: action.msg,
      });
    }
  }, [action]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={Boolean(message)}
      autoHideDuration={duration}
      onClose={() => setMessage(undefined)}
    >
      <SnackbarContent
        className={action ? classes[action.type] : undefined}
        aria-describedby="snackbar"
        message={
          <span id="snackbar" className={classes.message}>
            {message}
          </span>
        }
        action={
          action?.type === 'error'
            ? [
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setMessage(undefined)}
                >
                  <Close className={classes.icon} />
                </IconButton>,
              ]
            : undefined
        }
      />
    </Snackbar>
  );
};

export default CustomSnackbar;
