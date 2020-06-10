import { Fragment, useContext, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { getLikedStatus, toggleLike } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface LikeButtonProps {
  itemPath: string;
  likes: number;
}

const LikeButton = ({ itemPath, likes }: LikeButtonProps) => {
  const { translate } = useContext(GlobalContext);
  const { user } = useAuth();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [newLikes, setNewLikes] = useState(likes);

  useEffect(() => {
    let unsubscribe: firebase.Unsubscribe = () => {};

    if (user) {
      unsubscribe = getLikedStatus(itemPath, user.uid, setLiked);
    }

    return () => {
      unsubscribe();
    };
  }, [itemPath, user]);

  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    setSaving(true);

    toggleLike(itemPath, user.uid, liked).then(() => {
      setNewLikes(liked ? newLikes - 1 : newLikes + 1);
      setSaving(false);
    });
  };

  return (
    <Fragment>
      <Button
        aria-label={translate('like')}
        variant="outlined"
        color="secondary"
        startIcon={liked ? <Favorite /> : <FavoriteBorder />}
        onClick={like}
        disabled={saving}
      >
        {newLikes}
      </Button>
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default LikeButton;
