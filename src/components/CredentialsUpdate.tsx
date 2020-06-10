import { useContext, useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { updatePassword } from '@zoonk/services/users';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';

/**
 * Update a user's credentials.
 */
const CredentialsUpdate = () => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleSubmit = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    updatePassword(oldPassword, newPassword)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((err) => setSnackbar(firebaseError(err, 'password_update')));
  };

  return (
    <Paper variant="outlined" style={{ padding: theme.spacing(3) }}>
      <Typography component="h3" variant="h5">
        {translate('password_change')}
      </Typography>

      <form
        style={{ marginTop: theme.spacing(3) }}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              variant="outlined"
              fullWidth
              id="old-password"
              label={translate('password_old')}
              name="old-password"
              type="password"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              variant="outlined"
              fullWidth
              id="new-password"
              label={translate('password_new')}
              name="new-password"
              type="password"
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: theme.spacing(2) }}
        >
          {translate('save_changes')}
        </Button>
      </form>

      <Snackbar action={snackbar} />
    </Paper>
  );
};

export default CredentialsUpdate;
