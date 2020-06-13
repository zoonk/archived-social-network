import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const PinnedSortableList = dynamic(
  () => import('@zoonk/components/PinnedSortableList'),
  { ssr: false },
);

const PinnedPage: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();
  const groupId = String(query.id);

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
