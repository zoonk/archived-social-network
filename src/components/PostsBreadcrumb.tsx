import { useContext } from 'react';
import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { ContentSummary, Post } from '@zoonk/models';
import { GlobalContext, theme } from '@zoonk/utils';
import LinkChapter from './LinkChapter';
import LinkHome from './LinkHome';
import LinkPath from './LinkPath';
import LinkPosts from './LinkPosts';
import LinkTopic from './LinkTopic';

interface PostsBreadcrumbProps {
  category?: Post.Category;
  chapter?: ContentSummary;
  children?: React.ReactNode;
  path?: ContentSummary;
  title?: string;
  topicId?: string;
}

/**
 * Breadcrumb for posts.
 */
const PostsBreadcrumb = ({
  category,
  chapter,
  children,
  path,
  title,
  topicId,
}: PostsBreadcrumbProps) => {
  const { translate } = useContext(GlobalContext);

  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        {path && <LinkPath id={path.id} title={path.title} />}
        {chapter && <LinkChapter id={chapter.id} title={chapter.title} />}
        {category !== 'lessons' && (
          <LinkPosts
            category={category}
            chapterId={chapter?.id}
            topicId={topicId}
          />
        )}
        {children}
        <Typography color="textPrimary">
          {title || translate('see_all')}
        </Typography>
      </Breadcrumbs>
    </Paper>
  );
};

export default PostsBreadcrumb;
