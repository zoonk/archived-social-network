import { useContext, useEffect, useState } from 'react';
import {
  CardActions,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { Bookmark, Favorite } from '@material-ui/icons';
import { ContentCategory, SavedItem, SnackbarAction } from '@zoonk/models';
import {
  getLikedStatus,
  getSavedStatus,
  saveItem,
  toggleLike,
  unsaveItem,
} from '@zoonk/services';
import { GlobalContext, maxSavedItems, theme, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import ItemActionsMenu from './ItemActionsMenu';

interface ItemActionsProps {
  category: ContentCategory;
  hideEdits?: boolean;
  id: string;
  isAuthor?: boolean;
  likes: number;
  title: string;
  href?: string;
  linkAs?: string;
}

/**
 * Default user actions (e.g. save, like, edit, report, etc.)
 * @property `category` - item category (e.g. topics, examples, posts, etc.).
 * @property `hideEdits` - don't display a link to the edit history page.
 * @property `href` - routing path.
 * @property `id` - item ID.
 * @property `isAuthor` - set if the current user is the item author.
 * @property `likes` - likes count.
 * @property `linkAs` - routing `as` property.
 * @property `title` - Item's title.
 */
const ItemActions = ({
  category,
  hideEdits,
  href,
  id,
  isAuthor,
  likes,
  linkAs,
  title,
}: ItemActionsProps) => {
  const { translate, user } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [newLike, setNewLike] = useState<number>(0);
  const [saved, setSaved] = useState<firebase.firestore.DocumentReference>();

  const like = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    toggleLike(`${category}/${id}`, user.uid, liked).then(() => {
      setNewLike(liked ? -1 : 1);
    });
  };

  const save = (uid: string) => {
    const item: SavedItem.Create = {
      category,
      categoryId: id,
      itemPath: `${category}/${id}`,
      title,
      updatedAt: timestamp,
    };

    saveItem(item, uid);
  };

  const unsave = (ref: firebase.firestore.DocumentReference) => {
    unsaveItem(ref);
  };

  const toggleSaved = () => {
    if (!user) {
      setSnackbar({ type: 'error', msg: translate('need_to_be_loggedin') });
      return;
    }

    const hasFreePlan = user.subscription === 'free';
    const hasReachedLimit = user.saved >= maxSavedItems;

    if (hasFreePlan && hasReachedLimit) {
      setSnackbar({
        type: 'error',
        msg: translate('saved_limit_reached'),
        log: {
          code: 'free_plan_limit',
          description: 'item_save',
          opts: { category },
        },
      });
      return;
    }

    // Save this item if it's not saved yet.
    if (!saved) {
      save(user.uid);
      return;
    }

    // If it's already saved, then unsave it.
    unsave(saved);
  };

  // Check if the current user has liked the item being displayed.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = getLikedStatus(`${category}/${id}`, user.uid, setLiked);
    return () => unsubscribe();
  }, [category, id, user]);

  // Check if the current user has saved the item being displayed.
  useEffect(() => {
    if (!user) return;
    const unsubscribe = getSavedStatus(`${category}/${id}`, user.uid, setSaved);
    return () => unsubscribe();
  }, [category, id, user]);

  return (
    <CardActions disableSpacing style={{ padding: 0 }}>
      <Tooltip title={saved ? translate('saved') : translate('save')}>
        <IconButton
          edge="start"
          aria-label={saved ? translate('saved') : translate('save')}
          onClick={toggleSaved}
        >
          <Bookmark color={saved ? 'primary' : 'inherit'} />
        </IconButton>
      </Tooltip>

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
