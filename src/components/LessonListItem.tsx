import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Post } from '@zoonk/models';

interface LessonListItemProps {
  divider?: boolean;
  index: number;
  item: Post.Summary;
  status: 'completed' | 'notStarted';
}

const useStyles = makeStyles((theme) => ({
  notStarted: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  completed: { backgroundColor: theme.palette.success.main },
}));

const LessonListItem = ({
  divider,
  index,
  item,
  status,
}: LessonListItemProps) => {
  const classes = useStyles();
  const { query } = useRouter();
  const { description, id, title } = item;
  const lessonId = String(query.id);

  /**
   * We fetch a lesson's data in the backend after it's assigned to a chapter.
   * This means it might take a couple of seconds to fetch its data.
   * If the data isn't ready, then display a loading component.
   */
  if (!title) {
    return <CircularProgress />;
  }

  return (
    <NextLink href="/posts/[id]" as={`/posts/${id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
        selected={lessonId === id}
      >
        <ListItemAvatar>
          <Avatar variant="rounded" className={classes[status]}>
            {index + 1}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          secondary={description}
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
