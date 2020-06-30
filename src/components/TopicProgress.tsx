import { makeStyles } from '@material-ui/core';
import LinearProgressWithLabel from './LinearProgressWithLabel';

interface TopicProgressProps {
  progress: number;
}

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(1, 0) },
}));

const TopicProgress = ({ progress = 0 }: TopicProgressProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
};

export default TopicProgress;
