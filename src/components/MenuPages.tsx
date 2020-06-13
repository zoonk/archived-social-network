import { Fragment } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  AllInclusive,
  Comment,
  Description,
  GroupWork,
  History,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
  Subject,
  SupervisorAccount,
} from '@material-ui/icons';
import { getAboutId } from '@zoonk/utils';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  active: {
    color: theme.palette.primary.main,
  },
}));

const MenuPages = () => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { asPath } = useRouter();
  const classes = useStyles();
  const groupsLink = user ? '/groups/my' : '/groups';
  const homeLink = user ? '/following' : '/';
  const topicsLink = user ? '/topics/following' : '/topics';
  const isActive = (link: string): boolean => {
    if (asPath === '/') return link === asPath || link === '/following';
    if (asPath === '/following') return link === '/following';
    return link.includes(asPath);
  };
  const pages = [
    { link: homeLink, title: translate('timeline'), icon: <AllInclusive /> },
    { link: topicsLink, title: translate('topics'), icon: <Subject /> },
    { link: groupsLink, title: translate('groups'), icon: <GroupWork /> },
    { link: '/references', title: translate('references'), icon: <Link /> },
    { link: '/courses', title: translate('courses'), icon: <School /> },
    { link: '/books', title: translate('books'), icon: <MenuBook /> },
    { link: '/posts', title: translate('posts'), icon: <Description /> },
    {
      link: '/examples',
      title: translate('real_life_examples'),
      icon: <Language />,
    },
    {
      link: '/questions',
      title: translate('questions'),
      icon: <QuestionAnswer />,
    },
    { link: '/comments', title: translate('comments'), icon: <Comment /> },
    { link: '/edits', title: translate('edit_history'), icon: <History /> },
  ];
  const metaPages = [
    {
      link: '/groups/[id]',
      as: `/groups/${getAboutId()}`,
      title: translate('about_us'),
    },
    { link: '/contact', title: translate('contact_us') },
    { link: '/terms', title: translate('terms_service') },
    { link: '/privacy', title: translate('privacy_policy') },
  ];

  return (
    <Fragment>
      <List component="nav" aria-label={translate('page_list')} disablePadding>
        {user?.role === 'admin' && (
          <NextLink href="/admin" passHref>
            <ListItem divider button component="a">
              <ListItemIcon>
                <SupervisorAccount />
              </ListItemIcon>
              <ListItemText primary={translate('admin')} />
            </ListItem>
          </NextLink>
        )}

        {pages.map((page) => (
          <NextLink href={page.link} passHref key={page.title}>
            <ListItem
              button
              component="a"
              className={isActive(page.link) ? classes.active : undefined}
            >
              <ListItemIcon
                className={isActive(page.link) ? classes.active : undefined}
              >
                {page.icon}
              </ListItemIcon>
              <ListItemText primary={page.title} />
            </ListItem>
          </NextLink>
        ))}
      </List>

      <Divider />

      <List component="nav" aria-label={translate('about_list')}>
        {metaPages.map((page) => (
          <NextLink href={page.link} as={page.as} passHref key={page.title}>
            <ListItem
              button
              component="a"
              className={asPath === page.link ? classes.active : undefined}
            >
              <ListItemText primary={page.title} />
            </ListItem>
          </NextLink>
        ))}
      </List>
    </Fragment>
  );
};

export default MenuPages;
