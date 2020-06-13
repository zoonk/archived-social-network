import { Fragment, useEffect } from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getTimeline } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import NoFollowing from './NoFollowing';
import PostList from './PostList';
import useLoadMore from './useLoadMore';
import useTranslation from './useTranslation';

interface TimelineCardProps {
  limit?: number;
  userId: string;
}

const TimelineCard = ({ limit, userId }: TimelineCardProps) => {
  const translate = useTranslation();
  const { get, items, lastVisible, loading } = useLoadMore<Post.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({ data: getTimeline(userId, lastVisible, limit) });
  };

  useEffect(() => {
    get({
      data: getTimeline(userId, undefined, limit),
      replace: true,
    });
  }, [get, limit, userId]);

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
    </Fragment>
  );
};

export default TimelineCard;
