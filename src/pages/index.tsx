import { useEffect, useContext } from 'react';
import { NextPage } from 'next';
import { Container, Grid, makeStyles } from '@material-ui/core';
import LeaderboardCard from '@zoonk/components/LeaderboardCard';
import Meta from '@zoonk/components/Meta';
import PathsCard from '@zoonk/components/PathsCard';
import PostsCard from '@zoonk/components/PostsCard';
import TopicsCard from '@zoonk/components/TopicsCard';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(2, 0) },
  column: {
    '& > *': {
      margin: theme.spacing(2, 0),
    },
  },
}));

const Home: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();

  useEffect(() => {
    analytics().setCurrentScreen('home');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_home_title')}
        description={translate('seo_home_desc')}
        canonicalUrl={rootUrl}
        noAppName
      />

      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} sm={6} className={classes.column}>
          <PostsCard
            limit={10}
            allowAdd
            allowLoadMore
            title={translate('posts')}
          />
        </Grid>

        <Grid item xs={12} sm={6} className={classes.column}>
          <TopicsCard limit={7} allowAdd />
          <PathsCard limit={7} allowAdd />
          <LeaderboardCard limit={5} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
