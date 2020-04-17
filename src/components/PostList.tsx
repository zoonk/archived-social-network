import { Grid } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import PostListItem from './PostListItem';

interface PostListProps {
  items: Post.Get[];
}

/**
 * Display a list of posts.
 */
const PostList = ({ items }: PostListProps) => {
  return (
    <Grid container>
      {items.map((item) => (
        <Grid
          item
          xs={12}
          key={item.id}
          style={{ margin: theme.spacing(0.5, 0) }}
        >
          <PostListItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostList;
