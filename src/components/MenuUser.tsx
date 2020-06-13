import { Fragment, useContext } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { signOut } from '@zoonk/services/users';
import { UserContext, theme } from '@zoonk/utils';
import UserReputation from './UserReputation';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const MenuUser = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { xp } = useContext(UserContext);

  const logout = () => {
    signOut();
  };

  if (!user) {
    return <CircularProgress />;
  }

  return (
    <Fragment>
      <List style={{ width: '100%' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <NextLink href="/profile/[id]" as={`/profile/${user.username}`}>
              <a>
                <Avatar alt={user.name} src={user.photo || undefined} />
              </a>
            </NextLink>
          </ListItemAvatar>
          <ListItemText
            primary={user.name}
            secondary={<UserReputation xp={xp} />}
          />
        </ListItem>

        <Typography
          align="center"
          variant="body2"
          style={{ margin: theme.spacing(0, 2) }}
        >
          <NextLink href="/settings" passHref>
            <Link>{translate('edit_profile')}</Link>
          </NextLink>

          {' | '}

          <Link component="button" variant="body2" onClick={logout}>
            {translate('logout')}
          </Link>
        </Typography>
      </List>
    </Fragment>
  );
};

export default MenuUser;
