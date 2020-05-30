import { CardActions } from '@material-ui/core';
import { ContentCategory } from '@zoonk/models';
import ItemActionsMenu from './ItemActionsMenu';
import LikeButton from './LikeButton';

interface ItemActionsProps {
  category: ContentCategory;
  groupId?: string | null;
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
  groupId,
  href,
  id,
  isAuthor,
  likes,
  linkAs,
}: ItemActionsProps) => {
  return (
    <CardActions disableSpacing style={{ padding: 0 }}>
      <LikeButton likes={likes} itemPath={`${category}/${id}`} />
      <div style={{ flexGrow: 1 }} />
      <ItemActionsMenu
        hideEdits={hideEdits}
        href={href}
        isAuthor={isAuthor}
        linkAs={linkAs}
        groupId={groupId}
        postId={category === 'posts' ? id : undefined}
      />
    </CardActions>
  );
};

export default ItemActions;
