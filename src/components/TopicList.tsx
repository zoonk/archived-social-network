import { Fragment, useEffect } from 'react';
import { Button, List } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { listTopics } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import ListSkeleton from './ListSkeleton';
import NoItems from './NoItems';
import TopicListItem from './TopicListItem';
import useLoadMore from './useLoadMore';
import useTranslation from './useTranslation';

interface TopicListProps {
  allowLoadMore?: boolean;
  createdById?: string;
  limit?: number;
}

const TopicList = ({
  allowLoadMore,
  createdById,
  limit = 10,
}: TopicListProps) => {
  const translate = useTranslation();
  const { get, items, lastVisible, loading } = useLoadMore<Topic.Snapshot>(
    limit,
  );

  const loadMore = () => {
    get({ data: listTopics(lastVisible, createdById, limit) });
  };

  useEffect(() => {
    get({ data: listTopics(undefined, createdById, limit), replace: true });
  }, [get, createdById, limit]);

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
    </Fragment>
  );
};

export default TopicList;
