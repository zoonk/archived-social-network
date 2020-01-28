import { useContext } from 'react';
import NextLink from 'next/link';
import { Container, Link, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

/**
 * Message displayed to users when they're already logged in.
 * This is useful for authentication pages.
 */
const AlreadyLoggedin = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main" maxWidth="xs">
      <Paper style={{ marginTop: theme.spacing(8), padding: theme.spacing(3) }}>
        <Typography component="p" variant="body1">
          {translate('already_logged_in')}{' '}
          <NextLink href="/" passHref>
            <Link>{translate('go_home')}</Link>
          </NextLink>
        </Typography>
      </Paper>
    </Container>
  );
};

export default AlreadyLoggedin;
