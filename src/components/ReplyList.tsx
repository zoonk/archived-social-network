import { useEffect, useState } from 'react';
import { CircularProgress, List } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { liveReplies } from '@zoonk/services';
import CommentListItem from './CommentListItem';

interface ReplyListProps {
  commentId: string;
  divider?: boolean;
}

/**
 * Display a list of comments replies.
 * @property `commentId` - set which comment we should get replies from.
 * @property `divider` - define if we should display a divider line between items.
 */
const ReplyList = ({ commentId, divider }: ReplyListProps) => {
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
    <List>
      {replies.map((reply) => (
        <CommentListItem
          key={reply.id}
          item={reply}
          divider={divider}
          type="replies"
          onReply={undefined}
        />
      ))}
    </List>
  );
};

export default ReplyList;
