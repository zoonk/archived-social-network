import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const ChapterEdit = dynamic(() => import('@zoonk/components/ChapterEdit'), {
  ssr: false,
});

const EditChapter: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const { query } = useRouter();

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('edit')} noIndex />
      {query.id && <ChapterEdit id={String(query.id)} />}
    </Container>
  );
};

export default EditChapter;
