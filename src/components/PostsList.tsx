import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { Post } from '@zoonk/models';
import NoItems from './NoItems';
import PostList from './PostList';

// Dynamically loading this component to reduce the first load size.
const PostsLoadMore = dynamic(() => import('./PostsLoadMore'), { ssr: false });

interface PostsListProps {
  category?: Post.Category[];
  data: Post.Get[];
  groupId?: string;
  limit?: number;
  topicId?: string;
  userId?: string;
}

const PostsList = ({
  category,
  data,
  groupId,
  limit = 10,
  topicId,
  userId,
}: PostsListProps) => {
  const [items, setItems] = useState<Post.Get[]>(data);

  if (items.length === 0) return <NoItems />;

  return (
    <Fragment>
      <PostList items={items} />
      <PostsLoadMore
        category={category}
        groupId={groupId}
        lastItem={data[data.length - 1].id}
        length={items.length}
        limit={limit}
        topicId={topicId}
        userId={userId}
        onLoadMore={(res) => setItems([...items, ...res])}
      />
    </Fragment>
  );
};

export default PostsList;
