import { Comment } from '@zoonk/models';
import { getCommentsSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface DiscussionLoadMoreProps {
  lastItem: string | firebase.firestore.DocumentSnapshot;
  length: number;
  limit: number;
  userId?: string;
  onLoadMore: (posts: Comment.Get[]) => void;
}

const DiscussionLoadMore = ({
  lastItem,
  length,
  limit,
  userId,
  onLoadMore,
}: DiscussionLoadMoreProps) => {
  const lastPath =
    typeof lastItem === 'string' ? `comments/${lastItem}` : lastItem;

  return (
    <LoadMore<Comment.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) => getCommentsSnapshot(last, limit, userId)}
    />
  );
};

export default DiscussionLoadMore;
