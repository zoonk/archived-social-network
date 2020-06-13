import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Comment, Description } from '@material-ui/icons';
import useTranslation from './useTranslation';

interface MenuCommunityProps {
  id: string;
}

const useStyles = makeStyles((theme) => ({
  active: {
    color: theme.palette.primary.main,
  },
}));

const MenuProfile = ({ id }: MenuCommunityProps) => {
  const translate = useTranslation();
  const { pathname } = useRouter();
  const classes = useStyles();
  const menu = [
    {
      title: translate('posts'),
      href: '/profile/[id]',
      as: `/profile/${id}`,
      icon: <Description />,
    },
    {
      title: translate('comments'),
      href: '/profile/[id]/comments',
      as: `/profile/${id}/comments`,
      icon: <Comment />,
    },
  ];

  return (
    <List component="nav" disablePadding>
      {menu.map((item) => (
        <NextLink href={item.href} as={item.as} passHref key={item.as}>
          <ListItem
            button
            component="a"
            className={pathname === item.href ? classes.active : undefined}
          >
            <ListItemIcon
              className={pathname === item.href ? classes.active : undefined}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        </NextLink>
      ))}
    </List>
  );
};

export default MenuProfile;
