import { useEffect, useContext, useState } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container, Grid, makeStyles } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import FilterView from '@zoonk/components/FilterView';
import HomeShare from '@zoonk/components/HomeShare';
import Meta from '@zoonk/components/Meta';
import { ViewType } from '@zoonk/models';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const TopicsCard = dynamic(() => import('../components/TopicsCard'));
const TopicGrid = dynamic(() => import('../components/TopicGrid'));

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
  const [view, setView] = useState<ViewType>('grid');
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
        <Grid item xs={12} className={classes.column}>
          <CategoryTabs active="topics" />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <HomeShare />
            <FilterView view={view} onChange={setView} />
          </div>
          {view === 'grid' && <TopicGrid />}
          {view === 'list' && <TopicsCard hideHeader limit={10} allowAdd />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
