import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import SavedList from '@zoonk/components/SavedList';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const MyStudies: NextPage = () => {
  const { translate, profile, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('my_studies');
  }, []);

  if (user === undefined) {
    return <CircularProgress />;
  }

  if (user === null || !profile) {
    return <LoginForm />;
  }

  return (
    <Container component="main">
      <Meta
        title={translate('seo_studies_title')}
        description={translate('seo_studies_desc')}
        canonicalUrl={`${rootUrl}/my-studies`}
      />

      <UserBreadcrumb user={profile} title={translate('seo_studies_title')} />
      <SavedList />
    </Container>
  );
};

export default MyStudies;
