import { MenuItem } from '@material-ui/core';
import { timestamp } from '@zoonk/firebase/db';
import { updatePost } from '@zoonk/services';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface PinPostProps {
  postId: string;
}

const PinPost = ({ postId }: PinPostProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { snackbar } = useSnackbar();

  const pinPost = () => {
    if (!profile || !user) {
      snackbar('error', translate('need_to_be_loggedin'));
      return;
    }

    snackbar('progress');

    updatePost(
      {
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
        pinned: true,
      },
      postId,
    )
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <MenuItem button onClick={pinPost}>
      {translate('post_pin')}
    </MenuItem>
  );
};

export default PinPost;
