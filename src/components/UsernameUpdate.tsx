import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { createUsername, validateUsername } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const UsernameUpdate = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { action, snackbar } = useSnackbar();
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
    snackbar('progress');

    const isValid = await validateUsername(username);

    if (!isValid) {
      snackbar('error', translate('username_exists'));
      return;
    }

    createUsername(username, user.uid)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
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
          disabled={!valid || action === 'progress'}
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: theme.spacing(2) }}
        >
          {translate('save')}
        </Button>
      </form>
    </Paper>
  );
};

export default UsernameUpdate;
