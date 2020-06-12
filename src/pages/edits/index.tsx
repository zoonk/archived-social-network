import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { GlobalContext } from '@zoonk/utils';

const EditsList = dynamic(() => import('@zoonk/components/EditsList'), {
  ssr: false,
});

const Edits: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main">
      <Meta
        title={translate('edit_history')}
        description={translate('seo_edits_desc')}
        noIndex
      />
      <SidebarPage title={translate('post_share')}>
        <div>
          <EditsList displayTitle />
        </div>
      </SidebarPage>
    </Container>
  );
};

export default Edits;
