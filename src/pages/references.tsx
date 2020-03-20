import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

const References: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('references');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('references_links')}
        description={translate('seo_refs_desc')}
        canonicalUrl={`${rootUrl}/references`}
      />
      <HomeBreadcrumb title={translate('references')} />
      <CategoryTabs active="references" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        category={['references']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('references_links')}
      />
    </Container>
  );
};

export default References;
