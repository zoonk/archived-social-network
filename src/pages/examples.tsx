import { useContext } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PostsCard from '@zoonk/components/PostsCard';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext, rootUrl } from '@zoonk/utils';

const Examples: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('real_life_examples')}
        description={translate('seo_examples_desc')}
        canonicalUrl={`${rootUrl}/examples`}
      />
      <SidebarPage category="examples" title={translate('teach_example_title')}>
        <PostsCard category={['examples']} limit={10} />
      </SidebarPage>
    </Container>
  );
};

export default Examples;
