import { List, Typography } from '@material-ui/core';
import { ContentCategory, SearchResult } from '@zoonk/models';
import SearchListItem from './SearchListItem';
import useTranslation from './useTranslation';

interface SearchListProps {
  category: ContentCategory;
  items: ReadonlyArray<SearchResult>;
}

const SearchList = ({ category, items }: SearchListProps) => {
  const translate = useTranslation();

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
