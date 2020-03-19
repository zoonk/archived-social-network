import { Fragment } from 'react';
import { Post } from '@zoonk/models';
import TopicLabel from './TopicLabel';

interface PostListMetaProps {
  post: Post.Get;
}

/**
 * Metadata for a post list item.
 */
const PostListMeta = ({ post }: PostListMetaProps) => {
  const { topics } = post;

  return (
    <Fragment>
      {topics.slice(0, 3).map((id) => (
        <TopicLabel key={id} id={id} />
      ))}
    </Fragment>
  );
};

export default PostListMeta;
