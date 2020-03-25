import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Post } from '@zoonk/models';
import { markdownToText, theme } from '@zoonk/utils';

interface LessonListItemProps {
  divider?: boolean;
  index: number;
  item: Post.Summary;
}

/**
 * Display a single lesson as a list item.
 */
const LessonListItem = ({ divider, index, item }: LessonListItemProps) => {
  const { query } = useRouter();
  const { description, id, title } = item;
  const lessonId = String(query.lessonId);

  /**
   * We fetch a lesson's data in the backend after it's assigned to a chapter.
   * This means it might take a couple of seconds to fetch its data.
   * If the data isn't ready, then display a loading component.
   */
  if (!title) {
    return <CircularProgress />;
  }

  return (
    <NextLink
      href="/topics/[id]/chapters/[chapterId]/[lessonId]"
      as={`/topics/${query.id}/chapters/${query.chapterId}/${id}`}
      passHref
    >
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
        selected={lessonId === id}
      >
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
            {index + 1}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={markdownToText(description)}
          secondaryTypographyProps={{
            gutterBottom: false,
            noWrap: true,
          }}
        />
      </ListItem>
    </NextLink>
  );
};

export default LessonListItem;
