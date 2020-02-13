import { Fragment, useContext } from 'react';
import { Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import TopicLabel from './TopicLabel';

interface PostListMetaProps {
  post: Post.Get;
}

/**
 * Metadata for a post list item.
 */
const PostListMeta = ({ post }: PostListMetaProps) => {
  const { translate } = useContext(GlobalContext);
  const { comments, createdBy, likes, topics } = post;

  return (
    <Fragment>
      <Typography gutterBottom variant="body2" color="textSecondary">
        {createdBy?.name} - {translate('comments_count', { comments })} -{' '}
        {translate('likes_count', { likes })}
      </Typography>
      {topics.slice(0, 3).map((id) => (
        <TopicLabel key={id} id={id} />
      ))}
    </Fragment>
  );
};

export default PostListMeta;
