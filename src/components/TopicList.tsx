import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, List } from '@material-ui/core';
import { Topic, SnackbarAction } from '@zoonk/models';
import { listTopics } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import Snackbar from './Snackbar';
import TopicListItem from './TopicListItem';
import useLoadMore from './useLoadMore';

interface TopicListProps {
  allowLoadMore?: boolean;
  createdById?: string;
  limit?: number;
}

/**
 * Display a list of topics.
 * @property `allowLoadMore` - allow to load more items.
 * @property `createdById` - filter by author.
 * @property `limit` - # of topics to show.
 */
const TopicList = ({
  allowLoadMore,
  createdById,
  limit = 10,
}: TopicListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Topic.Snapshot
  >(limit);

  const loadMore = () => {
    get({ data: listTopics(lastVisible, createdById, limit) });
  };

  useEffect(() => {
    get({ data: listTopics(undefined, createdById, limit) });
  }, [get, createdById, limit]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'topics_list'));
    }
  }, [error]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <TopicListItem
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

export default TopicList;
