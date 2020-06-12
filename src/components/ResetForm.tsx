import { useContext, useState } from 'react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Grid, Link, TextField } from '@material-ui/core';
import Snackbar from '@zoonk/components/Snackbar';
import { SnackbarAction } from '@zoonk/models';
import { resetPassword } from '@zoonk/services/users';
import { GlobalContext, theme } from '@zoonk/utils';

const ResetPassword: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    setSnackbar({ msg: translate('reset_password_sending'), type: 'progress' });

    resetPassword(email)
      .then(() => {
        setSnackbar({ type: 'success', msg: translate('reset_password_sent') });
      })
      .catch((error) => {
        setSnackbar({
          msg: error.message,
          type: 'error',
          log: {
            code: error.code,
            description: 'reset_password',
          },
        });
      });
  };

  return (
    <form
      style={{
        width: '100%',
        marginTop: theme.spacing(3),
      }}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            required
            fullWidth
            id="email"
            label={translate('email')}
            name="email"
            autoComplete="email"
            type="email"
          />
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 2) }}
      >
        {translate('reset_password')}
      </Button>

      <Grid container justify="flex-end">
        <Grid item>
          <NextLink href={{ pathname: '/login', query }} passHref>
            <Link variant="body2">{translate('back_to_login')}</Link>
          </NextLink>
        </Grid>
      </Grid>
      <Snackbar action={snackbar} />
    </form>
  );
};

export default ResetPassword;
