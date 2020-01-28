import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Grid } from '@material-ui/core';
import AlgoliaLogo from '@zoonk/components/AlgoliaLogo';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import SearchCard from '@zoonk/components/SearchCard';
import { ContentCategory, SearchResult } from '@zoonk/models';
import { search } from '@zoonk/services';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Search: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const [results, setResults] = useState<
    algoliasearch.Response<SearchResult>[]
  >([]);
  const searchTerm = String(query.q);

  useEffect(() => {
    analytics().setCurrentScreen('search');
  }, []);

  useEffect(() => {
    if (query.q) {
      search(String(query.q)).then(setResults);
    }
  }, [query.q]);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_search_title', { searchTerm })}
        description={translate('seo_search_desc', { searchTerm })}
        canonicalUrl={`${rootUrl}/search?q=${query.q}`}
      />
      <HomeBreadcrumb title={`${translate('search')}: ${searchTerm}`} />
      <Grid container spacing={2}>
        {results.map((item) => (
          <Grid key={item.index} item xs={12} sm={6}>
            <SearchCard
              items={item.hits}
              category={item.index as ContentCategory}
            />
          </Grid>
        ))}
      </Grid>
      <AlgoliaLogo />
    </Container>
  );
};

export default Search;
