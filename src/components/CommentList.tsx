import { Fragment, useEffect, useState } from 'react';
import { CircularProgress, List, makeStyles } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import { liveComments } from '@zoonk/services';
import CommentForm from './CommentForm';
import CommentListItem from './CommentListItem';
import ReplyList from './ReplyList';

const useStyles = makeStyles((theme) => ({
  replyList: {
    marginLeft: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(6),
    },
  },
}));

interface CommentListProps {
  postId: string;
  groupId: string | null;
  topics: string[];
}

/**
 * Display a list of comments.
 */
const CommentList = ({ groupId, postId, topics }: CommentListProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment.Get[]>([]);
  const [reply, setReply] = useState<string>('');

  useEffect(() => {
    setLoading(true);

    const unsubscribe = liveComments(postId, (snap) => {
      setLoading(false);
      setComments(snap);
    });

    return () => {
      unsubscribe();
    };
  }, [postId]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <List>
      {comments.map((comment, index) => {
        const isLast = index === comments.length - 1;
        const hasReplies = comment.replies > 0;

        return (
          <Fragment key={comment.id}>
            <CommentListItem
              item={comment}
              divider={!isLast && !hasReplies}
              type="comments"
              onReply={setReply}
            />

            {reply === comment.id && (
              <CommentForm
                commentId={comment.id}
                groupId={groupId}
                postId={postId}
                topics={topics}
                onCancel={() => setReply('')}
                onSave={() => setReply('')}
              />
            )}

            {hasReplies && (
              <div className={classes.replyList}>
                <ReplyList commentId={comment.id} divider={!isLast} />
              </div>
            )}
          </Fragment>
        );
      })}
    </List>
  );
};

export default CommentList;
