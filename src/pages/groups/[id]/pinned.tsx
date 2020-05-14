import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import PinnedSortableList from '@zoonk/components/PinnedSortableList';
import { analytics, GlobalContext } from '@zoonk/utils';

const PinnedPage: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();
  const groupId = String(query.id);

  useEffect(() => {
    analytics().setCurrentScreen('group_pinned');
  }, []);

  if (!query.id) return null;

  return (
    <Container component="main">
      <Meta title={translate('post_pinned')} noIndex />
      <GroupsBreadcrumb groupId={groupId} title={translate('post_pinned')} />
      <PinnedSortableList groupId={groupId} />
    </Container>
  );
};

export default PinnedPage;
