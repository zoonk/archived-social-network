import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

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
      <PostsCard
        category={['examples']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        orderBy={['likes']}
        title={translate('examples')}
      />
    </Container>
  );
};

export default Examples;
