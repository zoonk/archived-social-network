import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Chapter } from '@zoonk/models';
import { theme } from '@zoonk/utils';

interface ChapterListItemProps {
  divider?: boolean;
  index: number;
  item: Chapter.Summary;
}

/**
 * Display a single chapter as a list item.
 */
const ChapterListItem = ({ divider, index, item }: ChapterListItemProps) => {
  const { query } = useRouter();
  const { description, title } = item;

  return (
    <NextLink
      href="/topics/[id]/chapters/[chapterId]"
      as={`/topics/${query.id}/chapters/${item.id}`}
      passHref
    >
      <ListItem
        alignItems="flex-start"
        button
        component="a"
        divider={divider}
        disableGutters
      >
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: theme.palette.primary.main }}>
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
