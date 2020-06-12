import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import AlreadyLoggedin from '@zoonk/components/AlreadyLoggedin';
import Snackbar from '@zoonk/components/Snackbar';
import SocialSignin from '@zoonk/components/SocialSignin';
import useAuth from '@zoonk/components/useAuth';
import { SnackbarAction } from '@zoonk/models';
import { signUp } from '@zoonk/services/users';
import { GlobalContext, theme } from '@zoonk/utils';

const SignUpForm = () => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const { query, push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signupSuccess, setSignup] = useState<boolean>(false);

  const handleSubmit = () => {
    setSnackbar({ msg: translate('creating_account'), type: 'progress' });

    signUp(email, password)
      .then((res) => res.user?.sendEmailVerification())
      .then(() => {
        setSignup(true);
        setSnackbar(null);

        if (query.redirect) {
          push(String(query.redirect));
        }
      })
      .catch((error) => {
        setSnackbar({
          msg: error.message,
          type: 'error',
          log: {
            code: error.code,
            description: 'signup',
          },
        });
      });
  };

  if (user === undefined) {
    return null;
  }

  if (user || signupSuccess) {
    return <AlreadyLoggedin />;
  }

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

        <Grid item xs={12}>
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            required
            fullWidth
            id="password"
            label={translate('password')}
            name="password"
            autoComplete="current-password"
            type="password"
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2">
            {translate('signup_notice')}{' '}
            <NextLink href="/terms" passHref>
              <Link>{translate('terms_service')}</Link>
            </NextLink>{' '}
            {translate('signup_notice_and')}{' '}
            <NextLink href="/privacy" passHref>
              <Link>{translate('privacy_policy')}</Link>
            </NextLink>
            .
          </Typography>
        </Grid>
      </Grid>

      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        style={{ margin: theme.spacing(3, 0, 2) }}
      >
        {translate('signup')}
      </Button>

      <Grid container justify="flex-end">
        <Grid item>
          <NextLink href={{ pathname: '/login', query }} passHref>
            <Link variant="body2">{translate('already_have_account')}</Link>
          </NextLink>
        </Grid>
      </Grid>

      <SocialSignin />
      <Snackbar action={snackbar} />
    </form>
  );
};

export default SignUpForm;
