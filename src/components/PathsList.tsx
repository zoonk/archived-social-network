import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, List } from '@material-ui/core';
import { Path, SnackbarAction } from '@zoonk/models';
import { listPaths } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import PathListItem from './PathListItem';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface PathListProps {
  allowLoadMore?: boolean;
  createdById?: string;
  limit?: number;
  topicId?: string;
}

/**
 * Display a list of learning paths.
 * @property `allowLoadMore` - display a "load more" button.
 * @property `createdById` - filter by author.
 * @property `limit` - # of learning paths to show.
 * @property `topicId` - filter by topic.
 */
const PathsList = ({
  allowLoadMore,
  createdById,
  limit = 10,
  topicId,
}: PathListProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Path.Snapshot
  >(limit);

  const loadMore = () => {
    get(listPaths({ createdById, topicId, lastVisible, limit }));
  };

  useEffect(() => {
    get(listPaths({ createdById, topicId, limit }));
  }, [get, createdById, limit, topicId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'path_list'));
    }
  }, [error]);

  if (items.length === 0 && loading === false) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <PathListItem
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

export default PathsList;
