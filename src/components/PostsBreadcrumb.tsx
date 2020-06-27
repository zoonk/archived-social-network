import { Breadcrumbs, Paper, Typography } from '@material-ui/core';
import { theme } from '@zoonk/utils';
import LinkChapter from './LinkChapter';
import LinkGroup from './LinkGroup';
import LinkHome from './LinkHome';
import LinkPost from './LinkPost';
import LinkTopic from './LinkTopic';

interface PostsBreadcrumbProps {
  chapterId?: string | null;
  chapterName?: string;
  groupId?: string | null;
  groupName?: string;
  postId?: string;
  postTitle?: string;
  title?: string;
  topicId?: string;
}

const PostsBreadcrumb = ({
  chapterId,
  chapterName,
  groupId,
  groupName,
  postId,
  postTitle,
  title,
  topicId,
}: PostsBreadcrumbProps) => {
  return (
    <Paper elevation={0} style={{ padding: theme.spacing(2, 0) }}>
      <Breadcrumbs>
        <LinkHome />
        {topicId && <LinkTopic id={topicId} />}
        {chapterId && <LinkChapter id={chapterId} title={chapterName} />}
        {groupId && <LinkGroup id={groupId} title={groupName} />}
        {postId && postTitle && <LinkPost id={postId} title={postTitle} />}
        {title && <Typography color="textPrimary">{title}</Typography>}
      </Breadcrumbs>
    </Paper>
  );
};

export default PostsBreadcrumb;
