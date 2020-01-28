import { Fragment, useEffect, useState } from 'react';
import { CircularProgress, List, makeStyles } from '@material-ui/core';
import { Comment, ContentCategory } from '@zoonk/models';
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
  category: ContentCategory;
  postId: string;
  topics: string[];
}

/**
 * Display a list of comments.
 * @property `category` - category where this comment was posted.
 * @property `postId` - which post we should get comments from.
 * @property `topics` - pass the post topics to be included in the comment
 * when adding it to the database.
 */
const CommentList = ({ category, postId, topics }: CommentListProps) => {
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
                category={category}
                commentId={comment.id}
                postId={postId}
                topics={topics}
                onCancel={() => setReply('')}
                onSave={() => setReply('')}
              />
            )}

            {Number(comment.replies) > 0 && (
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
