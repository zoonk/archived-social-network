import { Fragment, useContext, useState } from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { Comment } from '@zoonk/models';
import { PostContext } from '@zoonk/utils';
import CommentActions from './CommentActions';
import CommentForm from './CommentForm';
import CommentUser from './CommentUser';
import ReplyList from './ReplyList';
import RichTextViewer from './rich-text/RichTextViewer';

interface CommentCardProps {
  data: Comment.Get;
}

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2) },
  content: { margin: theme.spacing(2, 0) },
}));

const CommentCard = ({ data }: CommentCardProps) => {
  const { pinnedComment } = useContext(PostContext);
  const { category, content, createdBy, id, replies } = data;
  const [expanded, setExpanded] = useState<boolean>(false);
  const classes = useStyles();
  const isReply = category === 'replies';
  const hasReplies = replies > 0;
  const isPinned = pinnedComment === id;
  const pinnedStyle = { borderColor: green[600] };

  return (
    <Paper
      variant="outlined"
      className={classes.root}
      style={isPinned ? pinnedStyle : undefined}
    >
      <CommentUser user={createdBy} />
      <div className={classes.content}>
        <RichTextViewer content={content} />
      </div>
      <CommentActions
        data={data}
        onReply={isReply ? undefined : () => setExpanded(!expanded)}
      />

      {expanded && (
        <Fragment>
          <CommentForm commentId={id} onCancel={() => setExpanded(false)} />
          {hasReplies && <ReplyList commentId={id} />}
        </Fragment>
      )}
    </Paper>
  );
};

export default CommentCard;
