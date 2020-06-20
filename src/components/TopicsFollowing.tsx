import { Fragment, useEffect, useState } from 'react';
import { CircularProgress, List } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { getFollowingTopics } from '@zoonk/services';
import LoadMore from './LoadMore';
import NoFollowing from './NoFollowing';
import TopicListItem from './TopicListItem';

interface TopicsFollowingProps {
  userId: string;
}

const limit = 10;

const TopicsFollowing = ({ userId }: TopicsFollowingProps) => {
  const [items, setItems] = useState<Topic.Snapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getFollowingTopics(userId, undefined, limit).then((res) => {
      setLoading(false);
      setItems(res);
    });
  }, [userId]);

  if (loading) return <CircularProgress />;

  if (items.length === 0 && !loading) {
    return <NoFollowing />;
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
      <LoadMore<Topic.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => getFollowingTopics(userId, last, limit)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default TopicsFollowing;
