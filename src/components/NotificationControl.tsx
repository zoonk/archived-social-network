import { useEffect, useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { Notification, User } from '@zoonk/models';
import { updateNotificationSettings } from '@zoonk/services/users';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

interface NotificationControlProps {
  content: Notification.Type;
  label: string;
}

const useStyles = makeStyles((theme) => ({
  form: { marginTop: theme.spacing(3) },
}));

const NotificationControl = ({ content, label }: NotificationControlProps) => {
  const translate = useTranslation();
  const { user } = useAuth();
  const classes = useStyles();
  const [active, setActive] = useState<User.NotificationType[]>([]);

  const handleContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { checked } = event.target;
    const name = event.target.name as User.NotificationType;
    const action = checked ? 'add' : 'remove';
    const newArr: User.NotificationType[] =
      action === 'add'
        ? [...active, name]
        : active.filter((item) => item !== name);
    setActive(newArr);
    updateNotificationSettings(user.uid, content, newArr);
  };

  useEffect(() => {
    if (user) setActive(user.notificationSettings[content]);
  }, [content, user]);

  return (
    <FormControl component="fieldset" className={classes.form}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={active.includes('app')}
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
              checked={active.includes('email')}
              onChange={handleContent}
              name="email"
              color="primary"
            />
          }
          label={translate('email')}
        />
      </FormGroup>
    </FormControl>
  );
};

export default NotificationControl;
