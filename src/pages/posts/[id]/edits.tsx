import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import EditsList from '@zoonk/components/EditsList';
import LinkPost from '@zoonk/components/LinkPost';
import Meta from '@zoonk/components/Meta';
import PostsBreadcrumb from '@zoonk/components/PostsBreadcrumb';
import { analytics, GlobalContext } from '@zoonk/utils';

const LessonEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('lesson_edits');
  }, []);

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <PostsBreadcrumb title={translate('page_edits')}>
        <LinkPost title={translate('current_item')} id={String(query.id)} />
      </PostsBreadcrumb>
      {query.id && <EditsList itemPath={`posts/${query.id}`} />}
    </Container>
  );
};

export default LessonEdits;
