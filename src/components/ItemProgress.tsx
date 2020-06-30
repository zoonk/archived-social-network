import { makeStyles } from '@material-ui/core';
import LinearProgressWithLabel from './LinearProgressWithLabel';

interface ItemProgressProps {
  progress: number;
}

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(1, 0) },
}));

const ItemProgress = ({ progress = 0 }: ItemProgressProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
};

export default ItemProgress;
