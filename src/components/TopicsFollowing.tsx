import { Fragment, useContext, useEffect } from 'react';
import { Button, List } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { getFollowingTopics } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import NoFollowing from './NoFollowing';
import TopicListItem from './TopicListItem';
import useLoadMore from './useLoadMore';

interface TopicsFollowingProps {
  allowLoadMore?: boolean;
  userId: string;
  limit?: number;
}

const TopicsFollowing = ({
  allowLoadMore,
  userId,
  limit = 10,
}: TopicsFollowingProps) => {
  const { translate } = useContext(GlobalContext);
  const { get, items, lastVisible, loading } = useLoadMore<Topic.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({ data: getFollowingTopics(userId, lastVisible, limit) });
  };

  useEffect(() => {
    get({ data: getFollowingTopics(userId, undefined, limit), replace: true });
  }, [get, limit, userId]);

  if (items.length === 0 && loading === false) {
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
    </Fragment>
  );
};

export default TopicsFollowing;
