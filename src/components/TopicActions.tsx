import dynamic from 'next/dynamic';
import { CardActions, makeStyles } from '@material-ui/core';
import ItemActionsMenu from './ItemActionsMenu';

const FollowButton = dynamic(() => import('./FollowButton'), { ssr: false });
const LikeButton = dynamic(() => import('./LikeButton'), { ssr: false });

interface TopicActionsProps {
  id: string;
  likes: number;
}

const useStyles = makeStyles((theme) => ({
  root: { padding: 0 },
  grow: { flexGrow: 1 },
  spacing: { padding: theme.spacing(0, 0.5) },
}));

const TopicActions = ({ id, likes }: TopicActionsProps) => {
  const classes = useStyles();

  return (
    <CardActions disableSpacing className={classes.root}>
      <LikeButton likes={likes} itemPath={`topics/${id}`} />
      <div className={classes.spacing} />
      <FollowButton category="topics" categoryId={id} />
      <div className={classes.grow} />
      <ItemActionsMenu />
    </CardActions>
  );
};

export default TopicActions;
