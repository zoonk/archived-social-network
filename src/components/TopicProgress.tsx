import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Topic } from '@zoonk/models';
import { getTopicProgress } from '@zoonk/services';
import LinearProgressWithLabel from './LinearProgressWithLabel';
import useAuth from './useAuth';

interface TopicProgressProps {
  topic: Topic.Get;
}

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(1, 0) },
}));

const TopicProgress = ({ topic }: TopicProgressProps) => {
  const { user } = useAuth();
  const classes = useStyles();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (user) {
      getTopicProgress(topic, user.uid).then((res) =>
        setProgress(res.progress),
      );
    }
  }, [topic, user]);

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
};

export default TopicProgress;
