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
import { errorTimeout, successTimeout } from '@zoonk/utils';
import useSnackbar from './useSnackbar';

const useStyles = makeStyles((theme: Theme) => ({
  dismiss: {},
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
const CustomSnackbar = () => {
  const { snackbar, action, message } = useSnackbar();
  const classes = useStyles();
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    if (action === 'error') setDuration(errorTimeout);
    if (action === 'success') setDuration(successTimeout);
    if (!action || action === 'dismiss') setDuration(null);
  }, [action]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={Boolean(message)}
      autoHideDuration={duration}
      onClose={() => snackbar('dismiss')}
    >
      <SnackbarContent
        className={action ? classes[action] : undefined}
        aria-describedby="snackbar"
        message={
          <span id="snackbar" className={classes.message}>
            {message}
          </span>
        }
        action={
          action === 'error'
            ? [
                <IconButton
                  key="close"
                  aria-label="close"
                  color="inherit"
                  onClick={() => snackbar('dismiss')}
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
