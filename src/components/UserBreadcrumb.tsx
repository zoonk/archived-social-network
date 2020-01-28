import NextLink from 'next/link';
import { Breadcrumbs, Link, Paper, Typography } from '@material-ui/core';
import { Profile } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import LinkHome from './LinkHome';

interface UserBreadcrumbProps {
  title: string;
  user: Profile.Response;
}

/**
 * Breadcrum for user pages.
 */
const UserBreadcrumb = ({ title, user }: UserBreadcrumbProps) => {
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />

        <NextLink
          href="/profile/[id]"
          as={`/profile/${user.username}`}
          passHref
        >
          <Link color="inherit" title={user.name}>
            {user.name}
          </Link>
        </NextLink>

        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default UserBreadcrumb;
