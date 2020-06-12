import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import BackButton from '@zoonk/components/BackButton';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const EditsList = dynamic(() => import('@zoonk/components/EditsList'), {
  ssr: false,
});

const LessonEdits: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  return (
    <Container component="main">
      <Meta title={translate('page_edits')} noIndex />
      <BackButton />
      {query.id && <EditsList itemPath={`posts/${query.id}`} />}
    </Container>
  );
};

export default LessonEdits;
