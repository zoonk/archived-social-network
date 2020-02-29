import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { theme } from '@zoonk/utils';
import LinkChapter from './LinkChapter';
import LinkHome from './LinkHome';
import LinkTopic from './LinkTopic';

interface ChaptersBreadcrumbProps {
  page: string;
  title: string;
}

/**
 * Breadcrumb for chapters.
 */
const ChaptersBreadcrumb = ({ page, title }: ChaptersBreadcrumbProps) => {
  const { query } = useRouter();
  const topicId = String(query.id);
  const chapterId = String(query.chapterId);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        <LinkTopic id={topicId} />
        <LinkChapter id={chapterId} title={title} topicId={topicId} />
        <Typography color="textPrimary">{page}</Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default ChaptersBreadcrumb;
