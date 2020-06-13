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

interface GroupListHeaderProps {
  active: 'all' | 'myGroups';
}

const GroupListHeader = ({ active }: GroupListHeaderProps) => {
  const translate = useTranslation();
  const { user } = useAuth();
  const { push } = useRouter();
  const classes = useStyles();

  return (
    <nav className={classes.root}>
      {user && (
        <ButtonGroup color="primary">
          <Button
            variant={active === 'myGroups' ? 'contained' : undefined}
            disableElevation
            onClick={() => push('/groups/my')}
          >
            {translate('groups_my')}
          </Button>
          <Button
            variant={active === 'all' ? 'contained' : undefined}
            disableElevation
            onClick={() => push('/groups')}
          >
            {translate('all')}
          </Button>
        </ButtonGroup>
      )}
      <NextLink href="/groups/add" passHref>
        <Button component="a" color="primary" variant="outlined">
          {translate('group_create')}
        </Button>
      </NextLink>
    </nav>
  );
};

export default GroupListHeader;
