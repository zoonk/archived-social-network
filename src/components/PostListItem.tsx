import {
  Avatar,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { Description } from '@material-ui/icons';
import NextLink from 'next/link';
import { Post } from '@zoonk/models';
import { getPostImage, theme } from '@zoonk/utils';
import TopicLabel from './TopicLabel';

interface PostListItemProps {
  divider?: boolean;
  item: Post.Get;
}

/**
 * Display a single post as a list item.
 */
const PostListItem = ({ divider, item }: PostListItemProps) => {
  const { chapter, content, path, title, topics } = item;
  const image = getPostImage(content) || chapter?.photo || path?.photo;

  return (
    <ListItem alignItems="flex-start" divider={divider} disableGutters>
      <ListItemAvatar>
        <Avatar
          src={image || undefined}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <Description />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <NextLink href="/posts/[id]" as={`/posts/${item.id}`} passHref>
            <Link color="textPrimary">
              <Typography gutterBottom>{title}</Typography>
            </Link>
          </NextLink>
        }
        secondary={topics.slice(0, 3).map((id) => (
          <TopicLabel key={id} id={id} />
        ))}
      />
    </ListItem>
  );
};

export default PostListItem;
