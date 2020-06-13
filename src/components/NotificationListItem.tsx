import NextLink from 'next/link';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { Notification } from '@zoonk/models';
import NotificationRestore from './NotificationRestore';
import NotificationView from './NotificationView';
import useTranslation from './useTranslation';

interface NotificationListItemProps {
  item: Notification.Get;
  divider?: boolean;
}

const NotificationListItem = ({ item, divider }: NotificationListItemProps) => {
  const translate = useTranslation();
  const { action, activityId, category, title, updatedAt, user } = item;
  const editableText = `${user.name} ${translate(action)} ${title}.`;
  const commentText = translate('comment_notification', { name: user.name });
  const text = category === 'comments' ? commentText : editableText;

  return (
    <ListItem alignItems="flex-start" divider={divider} disableGutters>
      <NextLink href="/profile/[id]" as={`/profile/${user.username}`} passHref>
        <a>
          <ListItemAvatar>
            <Avatar src={user.photo || undefined} title={user.name} />
          </ListItemAvatar>
        </a>
      </NextLink>
      <ListItemText primary={text} secondary={updatedAt} />
      <ListItemSecondaryAction>
        {(action === 'created' || action === 'updated') && (
          <NotificationView item={item} />
        )}
        {action === 'deleted' && activityId && (
          <NotificationRestore id={activityId} />
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default NotificationListItem;
