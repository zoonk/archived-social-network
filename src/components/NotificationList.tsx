import { Fragment, useEffect, useState } from 'react';
import { CircularProgress, List } from '@material-ui/core';
import { Notification, User } from '@zoonk/models';
import { listNotifications, resetNotificationCount } from '@zoonk/services';
import LoadMore from './LoadMore';
import NoItems from './NoItems';
import NotificationListItem from './NotificationListItem';

interface NotificationListProps {
  limit?: number;
  settings: User.NotificationSettings;
  uid: string;
}

const NotificationList = ({
  limit = 10,
  settings,
  uid,
}: NotificationListProps) => {
  const [items, setItems] = useState<Notification.Snapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    listNotifications(uid, settings, undefined, limit).then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, [limit, settings, uid]);

  useEffect(() => {
    resetNotificationCount(uid);
  }, [uid]);

  if (loading) return <CircularProgress />;

  if (items.length === 0 && !loading) {
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
      <LoadMore<Notification.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => listNotifications(uid, settings, last, limit)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default NotificationList;
