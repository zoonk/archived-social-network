import { makeStyles, Paper } from '@material-ui/core';
import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('xs')]: {
      overflow: 'auto',
    },
  },
}));

const ToolbarStatic = () => {
  const classes = useStyles();

  return (
    <Paper elevation={0} className={classes.root}>
      <Toolbar />
    </Paper>
  );
};

export default ToolbarStatic;
