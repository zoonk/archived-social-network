import { makeStyles, Paper, Typography } from '@material-ui/core';
import NotificationControl from './NotificationControl';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const NotificationSettings = () => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <Paper variant="outlined" className={classes.root}>
      <Typography component="h3" variant="h5">
        {translate('notifications')}
      </Typography>

      <section className={classes.grid}>
        <NotificationControl
          content="contentChanges"
          label={translate('content_changes')}
        />
        <NotificationControl content="comments" label={translate('comments')} />
      </section>
    </Paper>
  );
};

export default NotificationSettings;
