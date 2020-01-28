import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkPath from './LinkPath';
import LinkTopic from './LinkTopic';

interface ChaptersBreadcrumbProps {
  children?: React.ReactNode;
  title: string;
  pathId?: string;
  topicId?: string;
}

/**
 * Breadcrumb for chapters.
 */
const ChaptersBreadcrumb = ({
  children,
  pathId,
  title,
  topicId,
}: ChaptersBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        {pathId && <LinkPath id={pathId} title={translate('chapters')} />}
        {children}
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default ChaptersBreadcrumb;
