import { makeStyles, Paper } from '@material-ui/core';

interface BottomBarProps {
  children: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: '69px',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    zIndex: 20,
  },
}));

const BottomBar = ({ children }: BottomBarProps) => {
  const classes = useStyles();

  return (
    <Paper elevation={10} className={classes.root}>
      {children}
    </Paper>
  );
};

export default BottomBar;
