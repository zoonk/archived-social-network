import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const PostsCard = dynamic(() => import('@zoonk/components/PostsCard'), {
  ssr: false,
});

const References: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('references_links')}
        description={translate('seo_refs_desc')}
        canonicalUrl={`${rootUrl}/references`}
      />
      <SidebarPage category="references" title={translate('teach_ref_title')}>
        <PostsCard category={['references']} limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default References;
