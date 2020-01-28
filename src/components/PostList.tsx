import { List } from '@material-ui/core';
import { Post } from '@zoonk/models';
import PostListItem from './PostListItem';

interface PostListProps {
  items: Post.Get[];
}

/**
 * Display a list of posts.
 */
const PostList = ({ items }: PostListProps) => {
  return (
    <List disablePadding>
      {items.map((item, index) => (
        <PostListItem
          key={item.id}
          divider={index !== items.length - 1}
          item={item}
        />
      ))}
    </List>
  );
};

export default PostList;
