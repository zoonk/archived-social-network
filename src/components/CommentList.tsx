import { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Comment as CommentIcon } from '@material-ui/icons';
import { Comment } from '@zoonk/models';
import { liveComments } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';

const useStyles = makeStyles((theme) => ({
  container: { margin: theme.spacing(5, 0) },
  title: { display: 'flex', alignItems: 'center' },
  titleIcon: { marginRight: theme.spacing(1) },
}));

interface CommentListProps {
  postId: string;
  groupId: string | null;
  topics: string[];
}

const CommentList = ({ groupId, postId, topics }: CommentListProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment.Get[]>([]);

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
    <div className={classes.container}>
      <Typography
        variant="h5"
        color="textSecondary"
        gutterBottom
        className={classes.title}
      >
        <CommentIcon fontSize="small" className={classes.titleIcon} />
        {translate('join_discussion')}
      </Typography>
      <CommentForm postId={postId} groupId={groupId} topics={topics} />
      <Grid container spacing={2}>
        {comments.map((comment) => (
          <Grid item xs={12} key={comment.id}>
            <CommentCard data={comment} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CommentList;
