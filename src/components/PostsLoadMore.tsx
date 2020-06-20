import { Post } from '@zoonk/models';
import { getPostsSnapshot } from '@zoonk/services';
import LoadMore from './LoadMore';

interface PostsLoadMoreProps {
  category?: Post.Category[];
  groupId?: string;
  lastItem: string | firebase.firestore.DocumentSnapshot;
  length: number;
  limit: number;
  topicId?: string;
  userId?: string;
  onLoadMore: (posts: Post.Get[]) => void;
}

const PostsLoadMore = ({
  category,
  groupId,
  lastItem,
  length,
  limit,
  topicId,
  userId,
  onLoadMore,
}: PostsLoadMoreProps) => {
  const lastPath =
    typeof lastItem === 'string' ? `posts/${lastItem}` : lastItem;

  return (
    <LoadMore<Post.Snapshot>
      lastPath={lastPath}
      length={length}
      limit={limit}
      onLoadMore={onLoadMore}
      request={(last) =>
        getPostsSnapshot({ category, groupId, last, limit, topicId, userId })
      }
    />
  );
};

export default PostsLoadMore;
