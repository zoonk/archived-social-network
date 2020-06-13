import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';
import { rootUrl } from '@zoonk/utils';

const SearchResults = dynamic(() => import('@zoonk/components/SearchResults'), {
  ssr: false,
});

const Search: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const searchTerm = String(query.q);

  return (
    <Container component="main">
      <Meta
        title={translate('seo_search_title', { searchTerm })}
        description={translate('seo_search_desc', { searchTerm })}
        canonicalUrl={`${rootUrl}/search?q=${query.q}`}
      />
      <HomeBreadcrumb title={`${translate('search')}: ${searchTerm}`} />
      {query.q && <SearchResults searchTerm={searchTerm} />}
    </Container>
  );
};

export default Search;
