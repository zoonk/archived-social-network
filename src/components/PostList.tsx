import { List } from '@material-ui/core';
import { Post } from '@zoonk/models';
import PostListItem from './PostListItem';

interface PostListProps {
  category?: Post.Category;
  items: Post.Get[];
}

/**
 * Display a list of posts.
 */
const PostList = ({ category, items }: PostListProps) => {
  return (
    <List disablePadding>
      {items.map((item, index) => (
        <PostListItem
          key={item.id}
          category={category}
          divider={index !== items.length - 1}
          index={index}
          item={item}
        />
      ))}
    </List>
  );
};

export default PostList;
