import { Fragment, useEffect, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { getTimeline } from '@zoonk/services';
import LoadMore from './LoadMore';
import NoFollowing from './NoFollowing';
import PostList from './PostList';

interface TimelineCardProps {
  limit?: number;
  userId: string;
}

const TimelineCard = ({ limit = 10, userId }: TimelineCardProps) => {
  const [items, setItems] = useState<Post.Snapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getTimeline(userId, undefined, limit).then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, [limit, userId]);

  if (loading) return <CircularProgress />;

  if (items.length === 0 && !loading) {
    return <NoFollowing />;
  }

  return (
    <Fragment>
      <PostList items={items} />
      <LoadMore<Post.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => getTimeline(userId, last, limit)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default TimelineCard;
