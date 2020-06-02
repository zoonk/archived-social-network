import { useContext, useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Grid,
  makeStyles,
  Paper,
  Switch,
  Typography,
} from '@material-ui/core';
import { User } from '@zoonk/models';
import { updateNotificationSettings } from '@zoonk/services';
import { GlobalContext } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(3) },
  form: { marginTop: theme.spacing(3) },
}));

const NotificationSettings = () => {
  const { translate, user } = useContext(GlobalContext);
  const classes = useStyles();
  const [content, setContent] = useState<User.NotificationType[]>([]);

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { checked } = event.target;
    const name = event.target.name as User.NotificationType;
    const action = checked ? 'add' : 'remove';
    const newArr: User.NotificationType[] =
      action === 'add'
        ? [...content, name]
        : content.filter((item) => item !== name);
    setContent(newArr);
    updateNotificationSettings(user.uid, { contentChanges: newArr });
  };

  useEffect(() => {
    if (user) setContent(user.notificationSettings.contentChanges);
  }, [user]);

  return (
    <Paper variant="outlined" className={classes.root}>
      <Typography component="h3" variant="h5">
        {translate('notifications')}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl component="fieldset" className={classes.form}>
            <FormLabel component="legend">
              {translate('content_changes')}
            </FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={content.includes('app')}
                    onChange={handleContent}
                    name="app"
                    color="primary"
                  />
                }
                label={translate('app')}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={content.includes('email')}
                    onChange={handleContent}
                    name="email"
                    color="primary"
                  />
                }
                label={translate('email')}
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NotificationSettings;
