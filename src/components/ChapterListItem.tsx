import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import NextLink from 'next/link';
import { Chapter, UserProgress } from '@zoonk/models';
import useTranslation from './useTranslation';

interface ChapterListItemProps {
  divider?: boolean;
  index: number;
  item: Chapter.Summary;
  status: UserProgress.ChapterStatus;
}

const useStyles = makeStyles((theme) => ({
  notStarted: {
    backgroundColor: 'white',
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
  },
  started: { backgroundColor: theme.palette.primary.main },
  completed: { backgroundColor: theme.palette.success.main },
}));

const ChapterListItem = ({
  divider,
  index,
  item,
  status,
}: ChapterListItemProps) => {
  const translate = useTranslation();
  const classes = useStyles();
  const { description, title } = item;

  return (
    <NextLink href="/chapters/[id]" as={`/chapters/${item.id}`} passHref>
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar
            variant="rounded"
            className={classes[status]}
            title={translate(status)}
          >
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

export default ChapterListItem;
