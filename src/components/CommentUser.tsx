import NextLink from 'next/link';
import { Avatar, Link, makeStyles } from '@material-ui/core';
import { Profile } from '@zoonk/models';

interface CommentUserProps {
  user: Profile.Response;
}

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', alignItems: 'center' },
  avatar: { marginRight: theme.spacing(1) },
  name: { display: 'flex', flexDirection: 'column' },
}));

const CommentUser = ({ user }: CommentUserProps) => {
  const { name, photo, username } = user;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
        <a>
          <Avatar
            src={photo || undefined}
            alt={name}
            className={classes.avatar}
          />
        </a>
      </NextLink>

      <div className={classes.name}>
        <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
          <Link variant="h6" color="textPrimary">
            {name}
          </Link>
        </NextLink>
      </div>
    </div>
  );
};

export default CommentUser;
