import { Fragment, useEffect, useState } from 'react';
import { CircularProgress, List } from '@material-ui/core';
import { Leaderboard } from '@zoonk/models';
import { getLeaderboard } from '@zoonk/services';
import LeaderboardListItem from './LeaderboardListItem';
import LoadMore from './LoadMore';
import NoItems from './NoItems';

interface LeaderboardListProps {
  limit?: number;
  topicId?: string;
}

const LeaderboardList = ({ limit = 5, topicId }: LeaderboardListProps) => {
  const [items, setItems] = useState<Leaderboard.Snapshot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLeaderboard(topicId, undefined, limit).then((res) => {
      setItems(res);
      setLoading(false);
    });
  }, [limit, topicId]);

  if (loading) return <CircularProgress />;

  if (items.length === 0 && !loading) {
    return <NoItems />;
  }

  return (
    <Fragment>
      <List disablePadding>
        {items.map((item, index) => (
          <LeaderboardListItem
            key={item.id}
            divider={index !== items.length - 1}
            item={item}
          />
        ))}
      </List>
      <LoadMore<Leaderboard.Snapshot>
        lastPath={items[items.length - 1].snap}
        length={items.length}
        limit={limit}
        request={(last) => getLeaderboard(topicId, last, limit)}
        onLoadMore={(newData) => setItems([...items, ...newData])}
      />
    </Fragment>
  );
};

export default LeaderboardList;
