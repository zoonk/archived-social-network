import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core';
import NextLink from 'next/link';
import { ContentCategory, SearchResult } from '@zoonk/models';

interface SearchListItemProps {
  category: ContentCategory;
  divider?: boolean;
  item: SearchResult;
}

/**
 * Display a single search result as a list item.
 */
const SearchListItem = ({ category, divider, item }: SearchListItemProps) => {
  const { description, objectID, photo, title } = item;

  return (
    <NextLink
      href={`/${category}/[id]`}
      as={`/${category}/${objectID}`}
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
          <Avatar src={photo || undefined} alt={title} />
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

export default SearchListItem;
