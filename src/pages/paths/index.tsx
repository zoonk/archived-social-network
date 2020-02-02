import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import PathsBreadcrumb from '@zoonk/components/PathsBreadcrumb';
import PathsCard from '@zoonk/components/PathsCard';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const Paths: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('paths');
  }, []);

  return (
    <Container component="main">
      <Meta
        title={translate('learningPaths')}
        description={translate('seo_learningPaths_desc')}
        canonicalUrl={`${rootUrl}/paths`}
      />
      <PathsBreadcrumb />
      <PathsCard allowLoadMore allowAdd hideLink limit={10} />
    </Container>
  );
};

export default Paths;
