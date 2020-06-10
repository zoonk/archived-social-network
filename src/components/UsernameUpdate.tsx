import { useCallback, useContext, useState } from 'react';
import { debounce } from 'lodash';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { createUsername, validateUsername } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

const UsernameUpdate = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [username, setUsername] = useState<string>(user?.username || '');
  const [valid, setValid] = useState<boolean>(true);

  const debounceUsername = useCallback(
    debounce(async (value: string) => {
      if (value.length === 0) return;
      const status = await validateUsername(value);
      setValid(status);
    }, 250),
    [],
  );

  if (!user) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUsername(event.target.value);
    debounceUsername(value);
  };

  const handleSubmit = async () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    const isValid = await validateUsername(username);

    if (!isValid) {
      setSnackbar({ type: 'error', msg: translate('username_exists') });
      return;
    }

    createUsername(username, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'username_update')));
  };

  return (
    <Paper variant="outlined" style={{ padding: theme.spacing(3) }}>
      <Typography component="h3" variant="h5">
        {translate('username')}
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
              error={!valid}
              value={username}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              id="update-username"
              label={translate('username')}
              helperText={!valid ? translate('username_exists') : undefined}
              name="username"
              type="text"
            />
          </Grid>
        </Grid>

        <Button
          disabled={!valid}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: theme.spacing(2) }}
        >
          {translate('save')}
        </Button>
      </form>

      <Snackbar action={snackbar} />
    </Paper>
  );
};

export default UsernameUpdate;
