import { Grid, makeStyles } from '@material-ui/core';
import MenuCommunity from '@zoonk/components/MenuCommunity';
import TopicDetails from '@zoonk/components/TopicDetails';
import { Topic } from '@zoonk/models';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface TopicBaseProps {
  children: React.ReactNode;
  topic: Topic.Get;
}

const TopicBase = ({ children, topic }: TopicBaseProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={4} className={classes.column}>
        <TopicDetails topic={topic} />
        <MenuCommunity category="topics" id={topic.id} />
      </Grid>

      <Grid item xs={12} sm={6} md={8} className={classes.column}>
        {children}
      </Grid>
    </Grid>
  );
};

export default TopicBase;
