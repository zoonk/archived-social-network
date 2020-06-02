import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, List } from '@material-ui/core';
import { Notification, SnackbarAction, User } from '@zoonk/models';
import { listNotifications, resetNotificationCount } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import NotificationListItem from './NotificationListItem';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface NotificationListProps {
  allowLoadMore?: boolean;
  limit?: number;
  settings: User.NotificationSettings;
  uid: string;
}

/**
 * Display a list of user notifications.
 */
const NotificationList = ({
  allowLoadMore,
  limit = 10,
  settings,
  uid,
}: NotificationListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Notification.Snapshot
  >(limit);

  const loadMore = () => {
    get({
      data: listNotifications(uid, settings, lastVisible, limit),
    });
  };

  useEffect(() => {
    get({
      data: listNotifications(uid, settings, undefined, limit),
    });
  }, [get, limit, settings, uid]);

  useEffect(() => {
    resetNotificationCount(uid);
  }, [uid]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'notifications_list'));
    }
  }, [error]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <NotificationListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>

      {loading && <ListSkeleton items={limit} />}

      {allowLoadMore && lastVisible && (
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={loadMore}
          style={{ margin: theme.spacing(3, 0, 2) }}
        >
          {translate('load_more')}
        </Button>
      )}

      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default NotificationList;
