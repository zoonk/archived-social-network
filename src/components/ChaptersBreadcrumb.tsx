import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import LinkChapter from './LinkChapter';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';

interface ChaptersBreadcrumbProps {
  chapterId: string;
  page: string;
  title: string;
  topicId?: string;
}

/**
 * Breadcrumb for chapters.
 */
const ChaptersBreadcrumb = ({
  chapterId,
  page,
  title,
  topicId,
}: ChaptersBreadcrumbProps) => {
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        <LinkChapter id={chapterId} title={title} />
        <Typography color="textPrimary">{page}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default ChaptersBreadcrumb;
