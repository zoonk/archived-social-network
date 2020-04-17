import { Grid, Hidden, makeStyles } from '@material-ui/core';
import HomeShare from '@zoonk/components/HomeShare';
import MenuPages from '@zoonk/components/MenuPages';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(2, 0) },
  column: {
    '& > *': {
      margin: theme.spacing(2, 0),
    },
  },
}));

interface SidebarPageProps {
  children: React.ReactNode;
}

const SidebarPage = ({ children }: SidebarPageProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.container}>
      <Hidden xsDown>
        <Grid item sm={3}>
          <MenuPages />
        </Grid>
      </Hidden>
      <Grid item xs={12} sm={9} className={classes.column}>
        <HomeShare />
        {children}
      </Grid>
    </Grid>
  );
};

export default SidebarPage;
