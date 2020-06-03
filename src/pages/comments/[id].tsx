import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container, makeStyles, Typography } from '@material-ui/core';
import DiscussionListItem from '@zoonk/components/DiscussionListItem';
import Meta from '@zoonk/components/Meta';
import { Comment } from '@zoonk/models';
import { getComment, listReplies } from '@zoonk/services';
import { analytics, GlobalContext, preRender } from '@zoonk/utils';

interface CommentPageProps {
  comment: Comment.Get | undefined;
  parent: Comment.Get | undefined;
  replies: Comment.Get[] | undefined;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

const CommentPage: NextPage<CommentPageProps> = ({
  comment,
  parent,
  replies,
}) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  useEffect(() => {
    analytics().setCurrentScreen('comment_view');
  }, []);

  return (
    <Container component="main" className={classes.root}>
      <Meta title={translate('comments')} noIndex />

      {!comment && (
        <Typography variant="body1">
          {translate('comment_not_found')}
        </Typography>
      )}

      {parent && <DiscussionListItem comment={parent} link="comments" />}
      {comment && <DiscussionListItem comment={comment} link="posts" />}
      {replies?.map((reply) => (
        <DiscussionListItem key={reply.id} comment={reply} link="posts" />
      ))}
    </Container>
  );
};

CommentPage.getInitialProps = async ({ query }) => {
  const id = String(query.id);
  const comment = await getComment(id);
  let parent;
  let replies;

  if (comment?.commentId) {
    parent = await getComment(comment.commentId);
  }

  if (comment?.replies) {
    replies = await listReplies(id);
  }

  preRender();
  return { comment, parent, replies };
};

export default CommentPage;
