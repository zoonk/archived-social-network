import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import TopicLabel from './TopicLabel';
import PostIcon from './PostIcon';
import useTranslation from './useTranslation';

interface PostListMetaProps {
  post: Post.Get;
}

const PostListMeta = ({ post }: PostListMetaProps) => {
  const translate = useTranslation();
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
      <div>
        {topics.slice(0, 3).map((id) => (
          <TopicLabel key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default PostListMeta;
