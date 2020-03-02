import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

const Books: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('books');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('books')}
        description={translate('seo_books_desc')}
        canonicalUrl={`${rootUrl}/books`}
      />
      <HomeBreadcrumb title={translate('books')} />
      <CategoryTabs active="books" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        category={['books']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        orderBy={['likes']}
        title={translate('books')}
      />
    </Container>
  );
};

export default Books;
