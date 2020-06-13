import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Grid, Link, TextField } from '@material-ui/core';
import { resetPassword } from '@zoonk/services/users';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const ResetPassword = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    snackbar('progress', translate('reset_password_sending'));

    resetPassword(email)
      .then(() => snackbar('success', translate('reset_password_sent')))
      .catch((e) => snackbar('error', e.message));
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
        disabled={action === 'progress'}
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
    </form>
  );
};

export default ResetPassword;
