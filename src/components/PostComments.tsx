import { useContext } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface PostCommentsProps {
  comments: number;
  groupId: string | null;
  postId: string;
  topics: string[];
}

const PostComments = ({
  comments,
  groupId,
  postId,
  topics,
}: PostCommentsProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography gutterBottom component="h3" variant="h6">
          {translate('comments_count', { comments })}
        </Typography>

        <CommentForm groupId={groupId} postId={postId} topics={topics} />
        <CommentList groupId={groupId} postId={postId} topics={topics} />
      </CardContent>
    </Card>
  );
};

export default PostComments;
