import { Button, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import Toolbar from './Toolbar';
import useTranslation from '../useTranslation';

interface ToolbarFixedProps {
  valid: boolean;
  saving: boolean;
  onSave: () => void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: theme.spacing(0.5),
    display: 'flex',
    zIndex: 20,
    [theme.breakpoints.down('xs')]: {
      overflow: 'auto',
    },
  },
  button: {
    [theme.breakpoints.down('xs')]: {
      position: 'fixed',
      bottom: '58px',
      right: '10px',
    },
  },
}));

const ToolbarFixed = ({ valid, saving, onSave }: ToolbarFixedProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <Paper square elevation={10} className={classes.root}>
      <Toolbar />
      <div style={{ flex: 1 }} />
      <Button
        disabled={!valid || saving}
        color="primary"
        variant="outlined"
        startIcon={
          saving ? <CircularProgress size={10} color="inherit" /> : undefined
        }
        onClick={onSave}
        className={classes.button}
      >
        {translate('save')}
      </Button>
    </Paper>
  );
};

export default ToolbarFixed;
