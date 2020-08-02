import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import {
  CircularProgress,
  Container,
  makeStyles,
  Typography,
} from '@material-ui/core';
import DiscussionListItem from '@zoonk/components/DiscussionListItem';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { Comment } from '@zoonk/models';
import { getComment, getReplies } from '@zoonk/services';

interface CommentPageProps {
  comment: Comment.Get | null;
  parent?: Comment.Get | null;
  replies?: Comment.Get[];
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<CommentPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const comment = await getComment(id);
  let parent;
  let replies;

  if (comment?.commentId) {
    parent = await getComment(comment.commentId);
  }

  if (comment?.replies) {
    replies = await getReplies(id);
  }

  return { props: { comment, parent, replies }, revalidate: 1 };
};

const CommentPage = ({
  comment,
  parent,
  replies,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const translate = useTranslation();
  const { isFallback } = useRouter();
  const classes = useStyles();
  const isLoading = isFallback && !comment;
  const noData = !comment && !isFallback;

  return (
    <Container component="main" className={classes.root}>
      <Meta title={translate('comments')} noIndex />

      {isLoading && <CircularProgress />}

      {noData && (
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

export default CommentPage;
