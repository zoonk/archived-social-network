import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Description, Link, VideoLibrary } from '@material-ui/icons';
import NextLink from 'next/link';
import { Post } from '@zoonk/models';

const useStyles = makeStyles((theme) => ({
  link: {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
  },
  text: {
    color: theme.palette.success.contrastText,
    backgroundColor: theme.palette.success.main,
  },
  video: {
    color: theme.palette.secondary.contrastText,
    backgroundColor: theme.palette.secondary.main,
  },
}));

interface PostListItemProps {
  divider?: boolean;
  item: Post.Get;
}

/**
 * Display a single post as a list item.
 */
const PostListItem = ({ divider, item }: PostListItemProps) => {
  const { content, format, title } = item;
  const classes = useStyles();

  return (
    <NextLink href="/posts/[id]" as={`/posts/${item.id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar className={classes[format]}>
            {format === 'text' && <Description />}
            {format === 'link' && <Link />}
            {format === 'video' && <VideoLibrary />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={content.slice(0, 200)}
          secondaryTypographyProps={{
            gutterBottom: false,
            noWrap: true,
          }}
        />
      </ListItem>
    </NextLink>
  );
};

export default PostListItem;
