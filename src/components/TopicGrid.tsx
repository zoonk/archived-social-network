import { useContext, useEffect } from 'react';
import { Button, Grid } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { listTopics } from '@zoonk/services';
import { GlobalContext, theme } from '@zoonk/utils';
import GridSkeleton from './GridSkeleton';
import TopicCard from './TopicCard';
import useLoadMore from './useLoadMore';

const limit = 12;

const TopicGrid = () => {
  const { translate } = useContext(GlobalContext);
  const { get, items, lastVisible, loading } = useLoadMore<Topic.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get(listTopics(lastVisible, undefined, limit));
  };

  useEffect(() => {
    get(listTopics(undefined, undefined, limit));
  }, [get]);

  return (
    <Grid container spacing={2}>
      {items.map((topic) => (
        <Grid item key={topic.title} xs={12} sm={4} md={3}>
          <TopicCard key={topic.title} topic={topic} />
        </Grid>
      ))}

      {loading && <GridSkeleton />}

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
    </Grid>
  );
};

export default TopicGrid;
