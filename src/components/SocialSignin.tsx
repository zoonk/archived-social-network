import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@material-ui/core';
import { signInWithFacebook, signInWithGoogle } from '@zoonk/services/users';
import { theme } from '@zoonk/utils';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

const SocialSignin = () => {
  const translate = useTranslation();
  const { query, push } = useRouter();
  const { action, snackbar } = useSnackbar();

  const signIn = (method: 'facebook' | 'google') => {
    snackbar('progress', translate('signing_in'));

    const fn = method === 'facebook' ? signInWithFacebook : signInWithGoogle;

    fn()
      .then(() => {
        snackbar('dismiss');
        if (query.redirect) push(String(query.redirect));
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Fragment>
      <Button
        fullWidth
        variant="contained"
        disabled={action === 'progress'}
        onClick={() => signIn('facebook')}
        style={{
          backgroundColor: '#3b5998',
          color: 'white',
          margin: theme.spacing(5, 0, 1),
        }}
      >
        {translate('signin_facebook')}
      </Button>

      <Button
        fullWidth
        disabled={action === 'progress'}
        variant="contained"
        onClick={() => signIn('google')}
        style={{
          backgroundColor: '#cc3333',
          color: 'white',
        }}
      >
        {translate('signin_google')}
      </Button>
    </Fragment>
  );
};

export default SocialSignin;
