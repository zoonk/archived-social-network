import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const References: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('references');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('references')}
        description={translate('seo_ref_desc')}
        canonicalUrl={`${rootUrl}/references`}
      />
      <HomeBreadcrumb title={translate('references')} />
      <PostsCard
        format={['link', 'video']}
        limit={10}
        hideLink
        allowAdd
        allowLoadMore
        title={translate('references')}
      />
    </Container>
  );
};

export default References;
