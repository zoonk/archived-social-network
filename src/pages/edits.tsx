import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import Meta from '@zoonk/components/Meta';
import SidebarPage from '@zoonk/components/SidebarPage';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Edits: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('edits');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('edit_history')}
        description={translate('seo_edits_desc')}
        canonicalUrl={`${rootUrl}/edits`}
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
