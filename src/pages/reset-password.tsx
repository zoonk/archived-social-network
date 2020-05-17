import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
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
import { MailOutline } from '@material-ui/icons';
import AlreadyLoggedin from '@zoonk/components/AlreadyLoggedin';
import Meta from '@zoonk/components/Meta';
import Snackbar from '@zoonk/components/Snackbar';
import { SnackbarAction } from '@zoonk/models';
import { auth, analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

const ResetPassword: NextPage = () => {
  const { translate, user } = useContext(GlobalContext);
  const { query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [email, setEmail] = useState<string>('');

  const handleSubmit = () => {
    setSnackbar({ msg: translate('reset_password_sending'), type: 'progress' });

    auth
      .sendPasswordResetEmail(email)
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

  useEffect(() => {
    analytics().setCurrentScreen('reset_password');
  }, []);

  if (user === undefined) {
    return null;
  }

  if (user) {
    return <AlreadyLoggedin />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta
        title={translate('reset_password')}
        description={translate('seo_reset_password_desc')}
        canonicalUrl={`${rootUrl}/reset-password`}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: theme.spacing(8),
        }}
      >
        <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
          <MailOutline />
        </Avatar>

        <Typography component="h2" variant="h5">
          {translate('reset_password')}
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
        </form>
      </div>

      <Snackbar action={snackbar} />
    </Container>
  );
};

export default ResetPassword;
