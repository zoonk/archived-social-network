import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import HomeBreadcrumb from '@zoonk/components/HomeBreadcrumb';
import Meta from '@zoonk/components/Meta';
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
      <HomeBreadcrumb title={translate('edit_history')} />
      <EditsList displayTitle />
    </Container>
  );
};

export default Edits;
