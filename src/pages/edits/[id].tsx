import { useContext } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import EditsBreadcrumb from '@zoonk/components/EditsBreadcrumb';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const EditGet = dynamic(() => import('@zoonk/components/EditGet'), {
  ssr: false,
});

const EditPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <EditsBreadcrumb />
      {query.id && <EditGet id={String(query.id)} />}
    </Container>
  );
};

export default EditPage;
