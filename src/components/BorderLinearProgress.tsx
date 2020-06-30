import {
  LinearProgress,
  LinearProgressProps,
  makeStyles,
  Theme,
} from '@material-ui/core';

const useStyles = makeStyles<Theme, LinearProgressProps>((theme) => ({
  root: {
    height: 10,
    borderRadius: 30,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[200],
  },
  bar: (props) => ({
    borderRadius: 30,
    backgroundColor:
      props.value === 100
        ? theme.palette.success.main
        : theme.palette.primary.main,
  }),
}));

const BorderLinearProgress = (props: LinearProgressProps) => {
  const classes = useStyles(props);
  return <LinearProgress {...props} classes={classes} />;
};

export default BorderLinearProgress;
