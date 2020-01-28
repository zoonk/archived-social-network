import { Fragment, useContext } from 'react';
import NextLink from 'next/link';
import {
  Avatar,
  Button,
  CircularProgress,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { auth, GlobalContext, UserContext, theme } from '@zoonk/utils';
import UserReputation from './UserReputation';

/**
 * Menu containing user information.
 */
const MenuUser = () => {
  const { translate, user } = useContext(GlobalContext);
  const { xp } = useContext(UserContext);

  const logout = () => {
    auth.signOut();
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

      <NextLink
        href={user.subscription === 'free' ? '/upgrade' : '/subscription'}
        passHref
      >
        <Button
          color={user.subscription === 'free' ? 'primary' : 'secondary'}
          variant="contained"
          style={{ margin: theme.spacing(0, 2, 2) }}
        >
          {user.subscription === 'free'
            ? translate('upgrade_premium')
            : translate('premium')}
        </Button>
      </NextLink>
    </Fragment>
  );
};

export default MenuUser;
