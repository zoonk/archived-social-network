import { useEffect, useState } from 'react';
import { SearchResponse } from '@algolia/client-search';
import { Grid } from '@material-ui/core';
import { ContentCategory, SearchResult } from '@zoonk/models';
import { search } from '@zoonk/services';
import AlgoliaLogo from './AlgoliaLogo';
import SearchCard from './SearchCard';

interface SearchResultsProps {
  searchTerm: string;
}

const SearchResults = ({ searchTerm }: SearchResultsProps) => {
  const [results, setResults] = useState<SearchResponse<SearchResult>[]>([]);

  useEffect(() => {
    search(searchTerm).then(setResults);
  }, [searchTerm]);

  return (
    <Grid container spacing={2}>
      {results.map((item) => (
        <Grid key={item.index} item xs={12} sm={6}>
          <SearchCard
            items={item.hits}
            category={item.index as ContentCategory}
          />
        </Grid>
      ))}
      <AlgoliaLogo />
    </Grid>
  );
};

export default SearchResults;
