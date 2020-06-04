import NextLink from 'next/link';
import { Avatar, Link, makeStyles, Paper, Typography } from '@material-ui/core';
import { Follower } from '@zoonk/models';
import UserReputation from './UserReputation';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(1) },
  content: { display: 'flex' },
  userMeta: { marginLeft: theme.spacing(1) },
  title: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

interface FolloweListItemProps {
  item: Follower.Get;
}

const FollowerListItem = ({ item }: FolloweListItemProps) => {
  const classes = useStyles();
  const { bio, name, photo, username, xp } = item;

  return (
    <Paper variant="outlined" className={classes.root}>
      <div className={classes.content}>
        <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
          <a>
            <Avatar src={photo || undefined} />
          </a>
        </NextLink>

        <div className={classes.userMeta}>
          <div className={classes.title}>
            <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
              <Link color="textPrimary">
                <Typography variant="h6" noWrap>
                  {name}
                </Typography>
              </Link>
            </NextLink>
            <UserReputation xp={xp} />
          </div>

          <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
            <Link variant="body2" gutterBottom>
              @{username}
            </Link>
          </NextLink>

          <Typography variant="body2" gutterBottom>
            {bio?.slice(0, 1000)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default FollowerListItem;
