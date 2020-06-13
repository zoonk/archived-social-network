import { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { Favorite, FavoriteBorder } from '@material-ui/icons';
import { getLikedStatus, toggleLike } from '@zoonk/services';
import useSnackbar from './useSnackbar';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface LikeButtonProps {
  itemPath: string;
  likes: number;
}

const LikeButton = ({ itemPath, likes }: LikeButtonProps) => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { snackbar } = useSnackbar();
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
      snackbar('error', translate('need_to_be_loggedin'));
      return;
    }

    setSaving(true);

    toggleLike(itemPath, user.uid, liked).then(() => {
      setNewLikes(liked ? newLikes - 1 : newLikes + 1);
      setSaving(false);
    });
  };

  return (
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
  );
};

export default LikeButton;
