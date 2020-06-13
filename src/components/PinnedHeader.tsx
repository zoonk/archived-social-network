import { Fragment } from 'react';
import NextLink from 'next/link';
import { Button, makeStyles, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import PinIcon from './PinIcon';
import useTranslation from './useTranslation';

interface PinnedHeaderProps {
  groupId: string;
  hideButtons?: boolean;
  topicId: string;
}

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', alignItems: 'center' },
  icon: { marginRight: theme.spacing(0.5), fontSize: '0.8rem' },
  spacing: { flexGrow: 1 },
  add: { marginRight: theme.spacing(0.5) },
}));

const PinnedHeader = ({ groupId, hideButtons, topicId }: PinnedHeaderProps) => {
  const translate = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PinIcon
        className={classes.icon}
        titleAccess={translate('post_pinned')}
      />
      <Typography variant="h5" component="h2">
        {translate('post_pinned')}
      </Typography>

      <div className={classes.spacing} />

      {!hideButtons && (
        <Fragment>
          <NextLink
            href={`/posts/add?groupId=${groupId}&topicId=${topicId}&pinned=true`}
            passHref
          >
            <Button component="a" size="small" color="primary">
              <Add aria-label={translate('create')} className={classes.add} />
              {translate('post_pinned_add')}
            </Button>
          </NextLink>

          <NextLink
            href="/groups/[id]/pinned"
            as={`/groups/${groupId}/pinned`}
            passHref
          >
            <Button component="a" size="small" color="secondary">
              {translate('reorder')}
            </Button>
          </NextLink>
        </Fragment>
      )}
    </div>
  );
};

export default PinnedHeader;
