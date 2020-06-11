import { Fragment, useContext, useState } from 'react';
import { MenuItem } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { SnackbarAction } from '@zoonk/models';
import { updatePost } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface PinPostProps {
  postId: string;
}

const PinPost = ({ postId }: PinPostProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  const pinPost = () => {
    if (!profile || !user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    setSnackbar({ type: 'progress', msg: translate('saving') });

    updatePost(
      {
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
        pinned: true,
      },
      postId,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'pin_post')));
  };

  return (
    <Fragment>
      <MenuItem button onClick={pinPost}>
        {translate('post_pin')}
      </MenuItem>
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PinPost;
