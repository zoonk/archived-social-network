import { useContext } from 'react';
import { Post } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import TopicLabel from './TopicLabel';
import PostIcon from './PostIcon';

interface PostListMetaProps {
  post: Post.Get;
}

/**
 * Metadata for a post list item.
 */
const PostListMeta = ({ post }: PostListMetaProps) => {
  const { translate } = useContext(GlobalContext);
  const { category, topics } = post;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <PostIcon
        category={category}
        iconProps={{
          fontSize: 'small',
          color: 'primary',
          title: translate(category),
        }}
      />
      <div style={{ margin: theme.spacing(0, 0.25) }} />
      {topics.slice(0, 3).map((id) => (
        <TopicLabel key={id} id={id} />
      ))}
    </div>
  );
};

export default PostListMeta;
