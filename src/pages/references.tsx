import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

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
      <SidebarPage category="references" title={translate('teach_ref_title')}>
        <PostsCard
          category={['references']}
          limit={10}
          listOnly
          allowLoadMore
        />
      </SidebarPage>
    </Container>
  );
};

export default References;
