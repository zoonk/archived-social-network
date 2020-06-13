import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, ButtonGroup, makeStyles } from '@material-ui/core';
import useAuth from './useAuth';
import useTranslation from './useTranslation';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));

interface TopicsHeaderProps {
  active: 'all' | 'following';
}

const TopicsHeader = ({ active }: TopicsHeaderProps) => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { push } = useRouter();
  const classes = useStyles();

  return (
    <nav className={classes.root}>
      {user && (
        <ButtonGroup color="primary">
          <Button
            variant={active === 'following' ? 'contained' : undefined}
            disableElevation
            onClick={() => push('/topics/following')}
          >
            {translate('following')}
          </Button>
          <Button
            variant={active === 'all' ? 'contained' : undefined}
            disableElevation
            onClick={() => push('/topics')}
          >
            {translate('all')}
          </Button>
        </ButtonGroup>
      )}
      <NextLink href="/topics/add" passHref>
        <Button component="a" color="primary" variant="outlined">
          {translate('topic_create')}
        </Button>
      </NextLink>
    </nav>
  );
};

export default TopicsHeader;
