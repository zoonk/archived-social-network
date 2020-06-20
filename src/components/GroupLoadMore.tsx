import { Group } from '@zoonk/models';
import { getGroupsSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface GroupLoadMoreProps {
  lastItem: string | firebase.firestore.DocumentSnapshot;
  length: number;
  limit: number;
  topicId?: string;
  userId?: string;
  onLoadMore: (posts: Group.Get[]) => void;
}

const GroupLoadMore = ({
  lastItem,
  length,
  limit,
  topicId,
  userId,
  onLoadMore,
}: GroupLoadMoreProps) => {
  const lastPathId = userId
    ? `users/${userId}/groups/${lastItem}`
    : `groups/${lastItem}`;

  const lastPath = typeof lastItem === 'string' ? lastPathId : lastItem;

  return (
    <LoadMore<Group.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) => getGroupsSnapshot({ last, limit, topicId, userId })}
    />
  );
};

export default GroupLoadMore;
