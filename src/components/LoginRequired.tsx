import { useContext } from 'react';
import NextLink from 'next/link';
import { Link, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';

interface LoginRequiredProps {
  message?: string;
}

/**
 * Message displayed to users warning they need
 * to login to perform an action.
 * @property `message` - custom message to display.
 */
const LoginRequired = ({ message }: LoginRequiredProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper style={{ margin: theme.spacing(2, 0), padding: theme.spacing(3) }}>
      <Typography component="p" variant="body1">
        {message || translate('login_required')}{' '}
        <NextLink href="/login" passHref>
          <Link>{translate('login')}</Link>
        </NextLink>
      </Typography>
    </Paper>
  );
};

export default LoginRequired;
