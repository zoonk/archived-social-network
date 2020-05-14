import { Grid } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import PinnedListItem from './PinnedListItem';

interface PostListProps {
  items: Post.Summary[];
}

const PinnedList = ({ items }: PostListProps) => {
  return (
    <Grid container>
      {items.map((item) => (
        <Grid
          item
          xs={12}
          key={item.id}
          style={{ margin: theme.spacing(0.5, 0) }}
        >
          <PinnedListItem item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PinnedList;
