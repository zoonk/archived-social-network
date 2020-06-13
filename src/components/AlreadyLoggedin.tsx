import NextLink from 'next/link';
import { Container, Link, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

const AlreadyLoggedin = () => {
  const translate = useTranslation();

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
