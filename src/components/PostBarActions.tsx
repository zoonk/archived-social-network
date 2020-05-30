import { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { Button, Hidden, makeStyles } from '@material-ui/core';
import { Edit, Favorite, FavoriteBorder } from '@material-ui/icons';
import { SnackbarAction } from '@zoonk/models';
import { getLikedStatus, toggleLike } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import Snackbar from './Snackbar';

interface PostBarActionsProps {
  canEdit: boolean;
  id: string;
  likes: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  button: {
    marginRight: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      marginRight: theme.spacing(0.5),
    },
  },
}));

const PostBarActions = ({ canEdit, id, likes }: PostBarActionsProps) => {
  const { translate, user } = useContext(GlobalContext);
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [newLike, setNewLike] = useState<number>(likes);

  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    setSaving(true);

    toggleLike(`posts/${id}`, user.uid, liked).then(() => {
      setNewLike(liked ? newLike - 1 : newLike + 1);
      setSaving(false);
    });
  };

  // Check if the current user has liked the item being displayed.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = getLikedStatus(`posts/${id}`, user.uid, setLiked);
    return () => unsubscribe();
  }, [id, user]);

  return (
    <div className={classes.root}>
      <Button
        color="secondary"
        variant="outlined"
        onClick={like}
        disabled={saving}
      >
        {liked ? (
          <Favorite className={classes.button} />
        ) : (
          <FavoriteBorder className={classes.button} />
        )}
        <Hidden smDown>{newLike}</Hidden>
      </Button>

      {canEdit && (
        <NextLink href="/posts/[id]/edit" as={`/posts/${id}/edit`} passHref>
          <Button color="primary" variant="outlined" component="a">
            <Edit className={classes.button} />
            <Hidden xsDown>{translate('edit')}</Hidden>
          </Button>
        </NextLink>
      )}

      <Snackbar action={snackbar} />
    </div>
  );
};

export default PostBarActions;
