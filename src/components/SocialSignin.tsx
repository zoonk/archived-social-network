import { Fragment, useContext, useState } from 'react';
import { Button } from '@material-ui/core';
import { SnackbarAction } from '@zoonk/models';
import { signInWithFacebook, signInWithGoogle } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';

/**
 * Login using social media accounts.
 */
const SocialSignin = () => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  const facebook = () => {
    setSnackbar({ type: 'progress', msg: translate('signing_in') });
    signInWithFacebook().catch((e) => setSnackbar(firebaseError(e, 'login')));
  };

  const google = () => {
    setSnackbar({ type: 'progress', msg: translate('signing_in') });
    signInWithGoogle().catch((e) => setSnackbar(firebaseError(e, 'login')));
  };

  return (
    <Fragment>
      <Button
        fullWidth
        variant="contained"
        onClick={facebook}
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
        variant="contained"
        onClick={google}
        style={{
          backgroundColor: '#cc3333',
          color: 'white',
        }}
      >
        {translate('signin_google')}
      </Button>

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default SocialSignin;
