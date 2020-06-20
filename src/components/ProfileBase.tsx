import { Container, Grid, makeStyles } from '@material-ui/core';
import { Leaderboard } from '@zoonk/models';
import HomeBreadcrumb from './HomeBreadcrumb';
import MenuProfile from './MenuProfile';
import ProfileCard from './ProfileCard';

const useStyles = makeStyles((theme) => ({
  column: {
    '& > *': {
      marginBottom: theme.spacing(2),
    },
  },
}));

interface ProfileProps {
  children: React.ReactNode;
  profile: Leaderboard.Get;
}

const ProfileBase = ({ children, profile }: ProfileProps) => {
  const classes = useStyles();
  const { name, username } = profile;

  return (
    <Container component="main">
      <HomeBreadcrumb title={name} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4} className={classes.column}>
          <ProfileCard data={profile} />
          <MenuProfile id={username} />
        </Grid>

        <Grid item xs={12} sm={6} md={8} className={classes.column}>
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfileBase;
