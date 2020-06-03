import { useContext } from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { GlobalContext } from '@zoonk/utils';
import NotificationControl from './NotificationControl';

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
  const { translate } = useContext(GlobalContext);
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
