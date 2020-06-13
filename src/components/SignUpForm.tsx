import { useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Grid, Link, TextField, Typography } from '@material-ui/core';
import { signUp } from '@zoonk/services/users';
import { theme } from '@zoonk/utils';
import AlreadyLoggedin from './AlreadyLoggedin';
import SocialSignin from './SocialSignin';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const SignUpForm = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { query, push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [signupSuccess, setSignup] = useState<boolean>(false);

  const handleSubmit = () => {
    snackbar('progress', translate('creating_account'));

    signUp(email, password)
      .then((res) => res.user?.sendEmailVerification())
      .then(() => {
        snackbar('dismiss');

        if (query.redirect) {
          push(String(query.redirect));
          return;
        }

        setSignup(true);
      })
      .catch((e) => snackbar('error', e.message));
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
        disabled={action === 'progress'}
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
    </form>
  );
};

export default SignUpForm;
