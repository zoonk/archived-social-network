import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import CategoryTabs from '@zoonk/components/CategoryTabs';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl, theme } from '@zoonk/utils';

const Examples: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('examples');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('real_life_examples')}
        description={translate('seo_examples_desc')}
        canonicalUrl={`${rootUrl}/examples`}
      />
      <HomeBreadcrumb title={translate('real_life_examples')} />
      <CategoryTabs active="examples" />
      <div style={{ margin: theme.spacing(1) }} />
      <PostsCard
        category={['examples']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('examples')}
      />
    </Container>
  );
};

export default Examples;
