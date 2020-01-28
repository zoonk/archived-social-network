import { useContext } from 'react';
import NextLink from 'next/link';
import { Breadcrumbs, Link, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';

interface PathBreadcrumbProps {
  title: string;
  topicId: string;
}

/**
 * Breadcrumb for a learning path page.
 */
const PathBreadcrumb = ({ title, topicId }: PathBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <LinkTopic id={topicId} />
        <NextLink
          href="/topics/[id]/paths"
          as={`/topics/${topicId}/paths`}
          passHref
        >
          <Link color="inherit" title={translate('learningPaths')}>
            {translate('learningPaths')}
          </Link>
        </NextLink>
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default PathBreadcrumb;
