import { Fragment, useContext } from 'react';
import NextLink from 'next/link';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Description,
  EmojiEvents,
  History,
  Language,
  MenuBook,
  QuestionAnswer,
  Subject,
  SupervisorAccount,
} from '@material-ui/icons';
import { GlobalContext } from '@zoonk/utils';

/**
 * Menu containing all available pages.
 */
const MenuPages = () => {
  const { translate, user } = useContext(GlobalContext);

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

        <NextLink href="/topics" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Subject />
            </ListItemIcon>
            <ListItemText primary={translate('topics')} />
          </ListItem>
        </NextLink>

        <NextLink href="/examples" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Language />
            </ListItemIcon>
            <ListItemText primary={translate('real_life_examples')} />
          </ListItem>
        </NextLink>

        <NextLink href="/posts" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <Description />
            </ListItemIcon>
            <ListItemText primary={translate('posts')} />
          </ListItem>
        </NextLink>

        <NextLink href="/courses" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <MenuBook />
            </ListItemIcon>
            <ListItemText primary={translate('courses_books')} />
          </ListItem>
        </NextLink>

        <NextLink href="/questions" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary={translate('questions')} />
          </ListItem>
        </NextLink>

        <NextLink href="/leaderboard" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <EmojiEvents />
            </ListItemIcon>
            <ListItemText primary={translate('leaderboard')} />
          </ListItem>
        </NextLink>

        <NextLink href="/edits" passHref>
          <ListItem button component="a">
            <ListItemIcon>
              <History />
            </ListItemIcon>
            <ListItemText primary={translate('edit_history')} />
          </ListItem>
        </NextLink>
      </List>

      <Divider />

      <List component="nav" aria-label={translate('about_list')}>
        <NextLink href="/contact" passHref>
          <ListItem button component="a">
            <ListItemText primary={translate('contact_us')} />
          </ListItem>
        </NextLink>

        <NextLink href="/terms" passHref>
          <ListItem button component="a">
            <ListItemText primary={translate('terms_service')} />
          </ListItem>
        </NextLink>

        <NextLink href="/privacy" passHref>
          <ListItem button component="a">
            <ListItemText primary={translate('privacy_policy')} />
          </ListItem>
        </NextLink>
      </List>
    </Fragment>
  );
};

export default MenuPages;
