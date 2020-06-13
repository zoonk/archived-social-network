import { Card, CardContent, Typography } from '@material-ui/core';
import { ContentCategory, SearchResult } from '@zoonk/models';
import AddButton from './AddButton';
import SearchList from './SearchList';
import useTranslation from './useTranslation';

interface SearchCardProps {
  category: ContentCategory;
  items: ReadonlyArray<SearchResult>;
}

const SearchCard = ({ category, items }: SearchCardProps) => {
  const translate = useTranslation();

  return (
    <Card variant="outlined" style={{ height: '100%' }}>
      <CardContent style={{ paddingBottom: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" component="h2">
            {translate(category)}
          </Typography>
          <AddButton category={category} />
        </div>
        <SearchList category={category} items={items} />
      </CardContent>
    </Card>
  );
};

export default SearchCard;
