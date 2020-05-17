import { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { liveReplies } from '@zoonk/services';
import CommentCard from './CommentCard';

interface ReplyListProps {
  commentId: string;
}

const ReplyList = ({ commentId }: ReplyListProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [replies, setReplies] = useState<Comment.Get[]>([]);

  // Fetch a list of comment replies.
  useEffect(() => {
    setLoading(true);

    const unsubscribe = liveReplies(commentId, (snap) => {
      setLoading(false);
      setReplies(snap);
    });

    return () => unsubscribe();
  }, [commentId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Grid container spacing={2}>
      {replies.map((reply) => (
        <Grid item xs={12} key={reply.id}>
          <CommentCard data={reply} />
        </Grid>
      ))}
    </Grid>
  );
};

export default ReplyList;
