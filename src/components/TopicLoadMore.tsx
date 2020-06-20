import { Topic } from '@zoonk/models';
import { getTopicsSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface TopicLoadMoreProps {
  lastItem: string | firebase.firestore.DocumentSnapshot;
  length: number;
  limit: number;
  userId?: string;
  onLoadMore: (posts: Topic.Get[]) => void;
}

const TopicLoadMore = ({
  lastItem,
  length,
  limit,
  userId,
  onLoadMore,
}: TopicLoadMoreProps) => {
  const lastPath =
    typeof lastItem === 'string' ? `topics/${lastItem}` : lastItem;

  return (
    <LoadMore<Topic.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) => getTopicsSnapshot({ last, limit, userId })}
    />
  );
};

export default TopicLoadMore;
