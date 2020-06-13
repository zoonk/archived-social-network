import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import useTranslation from './useTranslation';

interface LoginRequiredProps {
  message?: string;
}

const LoginRequired = ({ message }: LoginRequiredProps) => {
  const translate = useTranslation();
  const { asPath } = useRouter();

  return (
    <Paper style={{ margin: theme.spacing(2, 0), padding: theme.spacing(3) }}>
      <Typography component="p" variant="body1">
        {message || translate('login_required')}{' '}
        <NextLink href={`/login?redirect=${asPath}`} passHref>
          <Link>{translate('login')}</Link>
        </NextLink>
      </Typography>
    </Paper>
  );
};

export default LoginRequired;
