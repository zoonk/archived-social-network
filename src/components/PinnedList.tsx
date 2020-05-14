import { Grid } from '@material-ui/core';
import { Group } from '@zoonk/models';
import PinnedListItem from './PinnedListItem';

interface PostListProps {
  group: Group.Get;
}

const PinnedList = ({ group }: PostListProps) => {
  return (
    <Grid container spacing={2}>
      {group.pinnedPosts.map((item) => (
        <Grid item xs={6} md={4} lg={3} key={item.id}>
          <PinnedListItem item={item} groupImg={group.photo} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PinnedList;
