import { Follower } from '@zoonk/models';
import { getFollowersSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface FollowersLoadMoreProps {
  collection: Follower.Collections;
  doc: string;
  lastItem: string;
  length: number;
  limit: number;
  onLoadMore: (posts: Follower.Get[]) => void;
}

const FollowersLoadMore = ({
  collection,
  doc,
  lastItem,
  length,
  limit,
  onLoadMore,
}: FollowersLoadMoreProps) => {
  const lastPath =
    typeof lastItem === 'string'
      ? `${collection}/${doc}/followers/${lastItem}`
      : lastItem;

  return (
    <LoadMore<Follower.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) => getFollowersSnapshot({ collection, doc, last, limit })}
    />
  );
};

export default FollowersLoadMore;
