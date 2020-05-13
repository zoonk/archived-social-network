import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { signIn } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import SocialSignin from './SocialSignin';
import Snackbar from './Snackbar';

/**
 * Display a login form.
 */
const LoginForm = () => {
  const { translate } = useContext(GlobalContext);
  const { push, query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    setSnackbar({ msg: translate('signing_in'), type: 'progress' });

    signIn(email, password)
      .then(() => {
        if (query.redirect) {
          push(String(query.redirect));
        }
      })
      .catch((e) => setSnackbar(firebaseError(e, 'login')));
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: theme.spacing(8),
        }}
      >
        <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
          <LockOutlined />
        </Avatar>

        <Typography component="h2" variant="h5">
          {translate('login')}
        </Typography>

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
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ margin: theme.spacing(3, 0, 2) }}
          >
            {translate('login')}
          </Button>

          <Grid container>
            <Grid item xs>
              <NextLink href="/reset-password" passHref>
                <Link variant="body2">{translate('forgot_password')}</Link>
              </NextLink>
            </Grid>
            <Grid item>
              <NextLink href="/signup" passHref>
                <Link variant="body2">{translate('dont_have_account')}</Link>
              </NextLink>
            </Grid>
          </Grid>

          <SocialSignin />
        </form>
      </div>

      <Snackbar action={snackbar} />
    </Container>
  );
};

export default LoginForm;
