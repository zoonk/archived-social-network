import NextLink from 'next/link';
import { Avatar, Link, makeStyles } from '@material-ui/core';
import { Profile } from '@zoonk/models';
import ProfileSocial from './ProfileSocial';
import useTranslation from './useTranslation';

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
  const translate = useTranslation();

  return (
    <div className={classes.root}>
      <NextLink href="/profile/[id]" as={`/profile/${username}`} passHref>
        <a aria-label={translate('open_page', { title: name })}>
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
        <ProfileSocial data={user} />
      </div>
    </div>
  );
};

export default CommentUser;
