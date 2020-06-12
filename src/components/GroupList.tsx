import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, List } from '@material-ui/core';
import { Group, SnackbarAction } from '@zoonk/models';
import { listGroups } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import GroupListItem from './GroupListItem';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface GroupListProps {
  allowLoadMore?: boolean;
  limit?: number;
  topicId?: string;
  userId?: string;
}

const GroupList = ({
  allowLoadMore,
  limit = 10,
  topicId,
  userId,
}: GroupListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Group.Snapshot
  >(limit);

  const loadMore = () => {
    get({
      data: listGroups({ topicId, startAfter: lastVisible, userId, limit }),
    });
  };

  useEffect(() => {
    get({ data: listGroups({ topicId, userId, limit }) });
  }, [get, limit, topicId, userId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'groups_list'));
    }
  }, [error]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <GroupListItem
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

export default GroupList;
