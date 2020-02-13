import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { ContentSummary } from '@zoonk/models';
import { theme } from '@zoonk/utils';
import LinkHome from './LinkHome';
import LinkPath from './LinkPath';
import LinkTopic from './LinkTopic';

interface ChaptersBreadcrumbProps {
  children?: React.ReactNode;
  title: string;
  path?: ContentSummary;
  topicId?: string;
}

/**
 * Breadcrumb for chapters.
 */
const ChaptersBreadcrumb = ({
  children,
  path,
  title,
  topicId,
}: ChaptersBreadcrumbProps) => {
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        {path && <LinkPath id={path.id} title={path.title} />}
        {children}
        <Typography color="textPrimary">{title}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default ChaptersBreadcrumb;
