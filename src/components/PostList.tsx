import { Grid } from '@material-ui/core';
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
    <Grid container spacing={1}>
      {items.map((item) => (
        <Grid item xs={12} key={item.id}>
          <PostListItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
