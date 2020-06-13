import NextLink from 'next/link';
import { Link, Typography } from '@material-ui/core';
import useTranslation from './useTranslation';

const HavingIssuesLink = () => {
  const translate = useTranslation();

  return (
    <Typography variant="body2">
      {translate('having_issues')}{' '}
      <NextLink href="/contact?source=issues" passHref>
        <Link>{translate('let_us_know')}</Link>
      </NextLink>
    </Typography>
  );
};

export default HavingIssuesLink;
