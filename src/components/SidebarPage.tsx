import { Grid, Hidden, makeStyles } from '@material-ui/core';
import { Post } from '@zoonk/models';
import HomeSidebar from './HomeSidebar';
import PostShare from './PostShare';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2, 0),
    },
  },
  column: {
    '& > *': {
      margin: theme.spacing(2, 0),
    },
  },
  filter: { width: 'auto', margin: theme.spacing(2, 0) },
}));

interface SidebarPageProps {
  category?: Post.Category;
  children: React.ReactNode;
  title?: string;
}

const SidebarPage = ({ category, children, title }: SidebarPageProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item sm={3} xs={12}>
        <Hidden implementation="css" xsDown>
          <HomeSidebar />
        </Hidden>
      </Grid>

      <Grid item xs={12} sm={9} className={classes.column}>
        <PostShare category={category} title={title} />
        {children}
      </Grid>
    </Grid>
  );
};

export default SidebarPage;
