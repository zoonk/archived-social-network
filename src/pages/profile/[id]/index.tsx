import { useContext, useEffect } from 'react';
import { NextPage, NextPageContext } from 'next';
import { Container, Grid, makeStyles } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PathsCard from '@zoonk/components/PathsCard';
import PostsCard from '@zoonk/components/PostsCard';
import ProfileCard from '@zoonk/components/ProfileCard';
import TopicsCard from '@zoonk/components/TopicsCard';
import { Leaderboard } from '@zoonk/models';
import { getUserLeaderboard } from '@zoonk/services';
import { analytics, GlobalContext, preRender, rootUrl } from '@zoonk/utils';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface ProfileProps {
  profile: Leaderboard.Get;
}

const ProfilePage: NextPage<ProfileProps> = ({ profile }: ProfileProps) => {
  const { translate } = useContext(GlobalContext);
  const classes = useStyles();
  const { id, name, photo, username } = profile;

  useEffect(() => {
    analytics().setCurrentScreen('profile');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={name}
        description={translate('seo_profile_desc', { name })}
        image={photo}
        canonicalUrl={`${rootUrl}/profile/${username}`}
      />

      <HomeBreadcrumb title={name} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={classes.column}>
          <ProfileCard data={profile} />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.column}>
          <TopicsCard createdById={id} />
          <PathsCard createdById={id} />
          <PostsCard userId={id} limit={3} title={translate('posts')} />
        </Grid>
      </Grid>
    </Container>
  );
};

ProfilePage.getInitialProps = async ({ query }: NextPageContext) => {
  const profile = await getUserLeaderboard(String(query.id));
  preRender();
  return { profile };
};

export default ProfilePage;
