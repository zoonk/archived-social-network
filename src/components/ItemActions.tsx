import { useContext, useEffect, useState } from 'react';
import {
  CardActions,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Favorite } from '@material-ui/icons';
import { ContentCategory, SnackbarAction } from '@zoonk/models';
import { getLikedStatus, toggleLike } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import ItemActionsMenu from './ItemActionsMenu';

interface ItemActionsProps {
  category: ContentCategory;
  hideEdits?: boolean;
  id: string;
  isAuthor?: boolean;
  likes: number;
  href?: string;
  linkAs?: string;
}

/**
 * Default user actions (e.g. like, edit, report, etc.)
 */
const ItemActions = ({
  category,
  hideEdits,
  href,
  id,
  isAuthor,
  likes,
  linkAs,
}: ItemActionsProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [newLike, setNewLike] = useState<number>(0);

  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    toggleLike(`${category}/${id}`, user.uid, liked).then(() => {
      setNewLike(liked ? -1 : 1);
    });
  };

  // Check if the current user has liked the item being displayed.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = getLikedStatus(`${category}/${id}`, user.uid, setLiked);
    return () => unsubscribe();
  }, [category, id, user]);

  return (
    <CardActions disableSpacing style={{ padding: 0 }}>
      <Tooltip title={liked ? translate('liked') : translate('like')}>
        <div>
          <Typography
            component="span"
            variant="body2"
            color={liked ? 'secondary' : 'textSecondary'}
            style={{ paddingRight: theme.spacing(0.5) }}
          >
            {likes + newLike}
          </Typography>
          <IconButton
            edge="start"
            aria-label={liked ? translate('liked') : translate('like')}
            onClick={like}
          >
            <Favorite color={liked ? 'secondary' : 'inherit'} />
          </IconButton>
        </div>
      </Tooltip>

      <div style={{ flexGrow: 1 }} />

      <ItemActionsMenu
        hideEdits={hideEdits}
        href={href}
        isAuthor={isAuthor}
        linkAs={linkAs}
      />
      <Snackbar action={snackbar} />
    </CardActions>
  );
};

export default ItemActions;
