import { Button, CircularProgress, makeStyles, Paper } from '@material-ui/core';
import QuillToolbar from './QuillToolbar';
import useTranslation from '../useTranslation';

interface ToolbarProps {
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
    justifyContent: 'space-between',
    zIndex: 20,
    [theme.breakpoints.down('xs')]: {
      overflow: 'auto',
    },
  },
  divider: {
    margin: theme.spacing(1, 0.5),
  },
}));

const Toolbar = ({ valid, saving, onSave }: ToolbarProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <Paper square elevation={10} className={classes.root}>
      <QuillToolbar />
      <Button
        disabled={!valid || saving}
        color="primary"
        variant="outlined"
        startIcon={
          saving ? <CircularProgress size={10} color="inherit" /> : undefined
        }
        onClick={onSave}
      >
        {translate('save')}
      </Button>
    </Paper>
  );
};

export default Toolbar;
