import { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { updatePassword } from '@zoonk/services/users';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const CredentialsUpdate = () => {
  const translate = useTranslation();
  const { snackbar } = useSnackbar();
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');

  const handleSubmit = () => {
    snackbar('progress');

    updatePassword(oldPassword, newPassword)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
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
    </Paper>
  );
};

export default CredentialsUpdate;
