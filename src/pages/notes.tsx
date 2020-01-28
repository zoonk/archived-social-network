import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { CircularProgress, Container } from '@material-ui/core';
import LoginForm from '@zoonk/components/LoginForm';
import Meta from '@zoonk/components/Meta';
import NotesList from '@zoonk/components/NotesList';
import UserBreadcrumb from '@zoonk/components/UserBreadcrumb';
import { analytics, GlobalContext, rootUrl } from '@zoonk/utils';

const NotesPage: NextPage = () => {
  const { translate, profile, user } = useContext(GlobalContext);

  useEffect(() => {
    analytics().setCurrentScreen('notes');
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
        title={translate('my_notes')}
        description={translate('seo_notes_desc')}
        canonicalUrl={`${rootUrl}/notes`}
      />
      <UserBreadcrumb user={profile} title={translate('my_notes')} />
      <NotesList limit={Infinity} />
    </Container>
  );
};

export default NotesPage;
