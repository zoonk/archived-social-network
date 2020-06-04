import { Fragment, useContext, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { Post, SnackbarAction } from '@zoonk/models';
import { getTimeline } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import NoFollowing from './NoFollowing';
import PostList from './PostList';
import Snackbar from './Snackbar';
import useLoadMore from './useLoadMore';

interface TimelineCardProps {
  limit?: number;
  userId: string;
}

const TimelineCard = ({ limit, userId }: TimelineCardProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { error, get, items, lastVisible, loading } = useLoadMore<
    Post.Snapshot
  >(limit);

  const loadMore = () => {
    get({ data: getTimeline(userId, lastVisible, limit) });
  };

  useEffect(() => {
    get({
      data: getTimeline(userId, undefined, limit),
      replace: true,
    });
  }, [get, limit, userId]);

  useEffect(() => {
    if (error) {
      setSnackbar(firebaseError(error, 'timeline_list'));
    }
  }, [error]);

  return (
    <Fragment>
      {items.length === 0 && !loading && <NoFollowing />}
      {items.length > 0 && <PostList items={items} />}
      {loading && <CircularProgress />}
      {lastVisible && (
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

export default TimelineCard;
