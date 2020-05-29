import { Fragment, useState } from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { Comment } from '@zoonk/models';
import CommentActions from './CommentActions';
import CommentForm from './CommentForm';
import CommentUser from './CommentUser';
import ReplyList from './ReplyList';

interface CommentCardProps {
  data: Comment.Get;
}

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2) },
  content: { margin: theme.spacing(2, 0) },
}));

const CommentCard = ({ data }: CommentCardProps) => {
  const {
    category,
    content,
    createdBy,
    groupId,
    id,
    postId,
    replies,
    topics,
  } = data;
  const [expanded, setExpanded] = useState<boolean>(false);
  const classes = useStyles();
  const isReply = category === 'replies';
  const hasReplies = replies > 0;

  return (
    <Paper variant="outlined" className={classes.root}>
      <CommentUser user={createdBy} />
      <div className={classes.content}>
        {content.split('\n').map((line) => (
          <Typography variant="body1" key={line} gutterBottom>
            {line}
          </Typography>
        ))}
      </div>
      <CommentActions
        data={data}
        onReply={isReply ? undefined : () => setExpanded(!expanded)}
      />

      {expanded && (
        <Fragment>
          <CommentForm
            commentId={id}
            postId={postId}
            groupId={groupId}
            topics={topics}
            onCancel={() => setExpanded(false)}
          />

          {hasReplies && <ReplyList commentId={id} />}
        </Fragment>
      )}
    </Paper>
  );
};

export default CommentCard;
