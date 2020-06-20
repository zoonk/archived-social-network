import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  Description,
  GroupWork,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
} from '@material-ui/icons';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  active: {
    color: theme.palette.primary.main,
  },
}));

interface MenuCommunityProps {
  category: 'groups' | 'topics';
  id: string;
}

const MenuCommunity = ({ category, id }: MenuCommunityProps) => {
  const translate = useTranslation();
  const { asPath } = useRouter();
  const classes = useStyles();
  const sharedPages = [
    {
      href: `/${category}/[id]/references`,
      as: `/${category}/${id}/references`,
      title: translate('references'),
      icon: <Link />,
    },
    {
      href: `/${category}/[id]/courses`,
      as: `/${category}/${id}/courses`,
      title: translate('courses'),
      icon: <School />,
    },
    {
      href: `/${category}/[id]/books`,
      as: `/${category}/${id}/books`,
      title: translate('books'),
      icon: <MenuBook />,
    },
    {
      href: `/${category}/[id]/posts`,
      as: `/${category}/${id}/posts`,
      title: translate('posts'),
      icon: <Description />,
    },
    {
      href: `/${category}/[id]/examples`,
      as: `/${category}/${id}/examples`,
      title: translate('real_life_examples'),
      icon: <Language />,
    },
    {
      href: `/${category}/[id]/questions`,
      as: `/${category}/${id}/questions`,
      title: translate('questions'),
      icon: <QuestionAnswer />,
    },
  ];
  const topicPages = [
    ...sharedPages,
    {
      href: '/topics/[id]/groups',
      as: `/topics/${id}/groups`,
      title: translate('groups'),
      icon: <GroupWork />,
    },
  ];
  const pages = category === 'topics' ? topicPages : sharedPages;

  return (
    <List component="nav" disablePadding>
      {pages.map((page) => {
        const isActive = asPath.includes(page.as);
        const className = isActive ? classes.active : undefined;

        return (
          <NextLink href={page.href} as={page.as} passHref key={page.as}>
            <ListItem button component="a" className={className}>
              <ListItemIcon className={className}>{page.icon}</ListItemIcon>
              <ListItemText primary={page.title} />
            </ListItem>
          </NextLink>
        );
      })}
    </List>
  );
};

export default MenuCommunity;
