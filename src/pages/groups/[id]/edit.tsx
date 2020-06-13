import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import useTranslation from '@zoonk/components/useTranslation';

const GroupEdit = dynamic(() => import('@zoonk/components/GroupEdit'), {
  ssr: false,
});

const EditGroup: NextPage = () => {
  const translate = useTranslation();
  const { query } = useRouter();

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('group_edit')} noIndex />
      {query.id && <GroupEdit id={String(query.id)} />}
    </Container>
  );
};

export default EditGroup;
