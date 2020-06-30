import { createStyles, LinearProgress, withStyles } from '@material-ui/core';

const BorderLinearProgress = withStyles((theme) =>
  createStyles({
    root: {
      height: 10,
      borderRadius: 30,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[200],
    },
    bar: {
      borderRadius: 30,
      backgroundColor: theme.palette.primary.main,
    },
  }),
)(LinearProgress);

export default BorderLinearProgress;
