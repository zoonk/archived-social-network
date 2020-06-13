import NextLink from 'next/link';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
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

interface MenuCommunityProps {
  category: 'groups' | 'topics';
  id: string;
}

const MenuCommunity = ({ category, id }: MenuCommunityProps) => {
  const translate = useTranslation();

  return (
    <List component="nav" disablePadding>
      {category === 'topics' && (
        <NextLink
          href="/topics/[id]/groups"
          as={`/topics/${id}/groups`}
          passHref
        >
          <ListItem button component="a">
            <ListItemIcon>
              <GroupWork />
            </ListItemIcon>
            <ListItemText primary={translate('groups')} />
          </ListItem>
        </NextLink>
      )}

      <NextLink
        href={`/${category}/[id]/references`}
        as={`/${category}/${id}/references`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <Link />
          </ListItemIcon>
          <ListItemText primary={translate('references')} />
        </ListItem>
      </NextLink>

      <NextLink
        href={`/${category}/[id]/courses`}
        as={`/${category}/${id}/courses`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary={translate('courses')} />
        </ListItem>
      </NextLink>

      <NextLink
        href={`/${category}/[id]/books`}
        as={`/${category}/${id}/books`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          <ListItemText primary={translate('books')} />
        </ListItem>
      </NextLink>

      <NextLink
        href={`/${category}/[id]/posts`}
        as={`/${category}/${id}/posts`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <Description />
          </ListItemIcon>
          <ListItemText primary={translate('posts')} />
        </ListItem>
      </NextLink>

      <NextLink
        href={`/${category}/[id]/examples`}
        as={`/${category}/${id}/examples`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <Language />
          </ListItemIcon>
          <ListItemText primary={translate('real_life_examples')} />
        </ListItem>
      </NextLink>

      <NextLink
        href={`/${category}/[id]/questions`}
        as={`/${category}/${id}/questions`}
        passHref
      >
        <ListItem button component="a">
          <ListItemIcon>
            <QuestionAnswer />
          </ListItemIcon>
          <ListItemText primary={translate('questions')} />
        </ListItem>
      </NextLink>
    </List>
  );
};

export default MenuCommunity;
