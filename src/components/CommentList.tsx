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
import { PostContext } from '@zoonk/utils';
import CommentCard from './CommentCard';
import CommentForm from './CommentForm';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  container: { margin: theme.spacing(5, 0) },
  title: { display: 'flex', alignItems: 'center' },
  titleIcon: { marginRight: theme.spacing(1) },
}));

const CommentList = () => {
  const translate = useTranslation();
  const { category, id, pinnedComment } = useContext(PostContext);
  const classes = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment.Get[]>([]);

  // Sort comments to move the pinned item to the top
  const sortedComments = comments.sort(
    (a, b) => Number(b.id === pinnedComment) - Number(a.id === pinnedComment),
  );

  useEffect(() => {
    setLoading(true);

    const unsubscribe = liveComments(id, (snap) => {
      setLoading(false);
      setComments(snap);
    });

    return () => {
      unsubscribe();
    };
  }, [id]);

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
        {category === 'questions'
          ? translate('answers')
          : translate('join_discussion')}
      </Typography>
      <CommentForm />
      <Grid container spacing={2}>
        {sortedComments.map((comment) => (
          <Grid item xs={12} key={comment.id}>
            <CommentCard data={comment} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CommentList;
