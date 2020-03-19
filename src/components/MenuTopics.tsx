import { useContext } from 'react';
import NextLink from 'next/link';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  Description,
  Language,
  Link,
  MenuBook,
  QuestionAnswer,
  School,
} from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

interface MenuTopics {
  topicId: string;
}

const MenuTopics = ({ topicId }: MenuTopics) => {
  const { translate } = useContext(GlobalContext);

  return (
    <List component="nav" disablePadding>
      <NextLink
        href="/topics/[id]/references"
        as={`/topics/${topicId}/references`}
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
        href="/topics/[id]/courses"
        as={`/topics/${topicId}/courses`}
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
        href="/topics/[id]/books"
        as={`/topics/${topicId}/books`}
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
        href="/topics/[id]/posts"
        as={`/topics/${topicId}/posts`}
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
        href="/topics/[id]/examples"
        as={`/topics/${topicId}/examples`}
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
        href="/topics/[id]/questions"
        as={`/topics/${topicId}/questions`}
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

export default MenuTopics;
