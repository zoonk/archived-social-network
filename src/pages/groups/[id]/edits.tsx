import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import GroupsBreadcrumb from '@zoonk/components/GroupsBreadcrumb';
import useTranslation from '@zoonk/components/useTranslation';

const EditsList = dynamic(() => import('@zoonk/components/EditsList'), {
  ssr: false,
});

const GroupEdits: NextPage = () => {
  const { query } = useRouter();
  const translate = useTranslation();
  const id = String(query.id);

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <GroupsBreadcrumb groupId={id} title={translate('see_all_edits')} />
      {query.id && <EditsList itemPath={`groups/${id}`} />}
    </Container>
  );
};

export default GroupEdits;
