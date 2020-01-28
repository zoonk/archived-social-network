import { useContext } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface PostCommentsProps {
  comments: number;
  postId: string;
  topics: string[];
}

/**
 * Display a list of comments for a post.
 * @property `comments` - number of comments.
 * @property `postId`
 * @property `topics` - topics/tags this post belongs to.
 */
const PostComments = ({ comments, postId, topics }: PostCommentsProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom component="h3" variant="h4">
          {translate('comments_count', { comments })}
        </Typography>

        <CommentForm category="posts" postId={postId} topics={topics} />
        <CommentList category="posts" postId={postId} topics={topics} />
      </CardContent>
    </Card>
  );
};

export default PostComments;
