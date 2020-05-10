import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { Post } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkChapter from './LinkChapter';
import LinkHome from './LinkHome';
import LinkPosts from './LinkPosts';
import LinkTopic from './LinkTopic';

interface PostsBreadcrumbProps {
  category?: Post.Category;
  chapterId?: string | null;
  chapterName?: string;
  children?: React.ReactNode;
  title?: string;
  topicId?: string;
}

/**
 * Breadcrumb for posts.
 */
const PostsBreadcrumb = ({
  category,
  chapterId,
  chapterName,
  children,
  title,
  topicId,
}: PostsBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        {chapterId && <LinkChapter id={chapterId} title={chapterName} />}
        {!chapterId && <LinkPosts category={category} topicId={topicId} />}
        {children}
        <Typography color="textPrimary">
          {title || translate('see_all')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default PostsBreadcrumb;
