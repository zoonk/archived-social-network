import {
  Avatar,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Post } from '@zoonk/models';
import { getPostImage, theme } from '@zoonk/utils';
import PostIcon from './PostIcon';
import PostListMeta from './PostListMeta';

interface PostListItemProps {
  divider?: boolean;
  item: Post.Get;
}

/**
 * Display a single post as a list item.
 */
const PostListItem = ({ divider, item }: PostListItemProps) => {
  const { category, content, cover, title } = item;
  const image = cover || getPostImage(content);

  return (
    <ListItem alignItems="flex-start" divider={divider} disableGutters>
      <ListItemAvatar>
        <Avatar
          src={image || undefined}
          style={{ backgroundColor: theme.palette.primary.main }}
        >
          <PostIcon category={category} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <NextLink href="/posts/[id]" as={`/posts/${item.id}`} passHref>
            <Link color="textPrimary">
              <Typography style={{ fontSize: '1.15rem' }}>{title}</Typography>
            </Link>
          </NextLink>
        }
        secondary={<PostListMeta post={item} />}
      />
    </ListItem>
  );
};

export default PostListItem;
