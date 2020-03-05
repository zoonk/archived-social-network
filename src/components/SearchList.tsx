import { useContext } from 'react';
import { List, Typography } from '@material-ui/core';
import { ContentCategory, SearchResult } from '@zoonk/models';
import { GlobalContext } from '@zoonk/utils';
import SearchListItem from './SearchListItem';

interface SearchListProps {
  category: ContentCategory;
  items: ReadonlyArray<SearchResult>;
}

/**
 * Display a list of search results.
 */
const SearchList = ({ category, items }: SearchListProps) => {
  const { translate } = useContext(GlobalContext);

  if (items.length === 0) {
    return <Typography gutterBottom>{translate('items_empty')}</Typography>;
  }

  return (
    <List disablePadding>
      {items.map((item, index) => (
        <SearchListItem
          key={item.objectID}
          category={category}
          divider={index !== items.length - 1}
          item={item}
        />
      ))}
    </List>
  );
};

export default SearchList;
