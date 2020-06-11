import { useContext } from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Container } from '@material-ui/core';
import Meta from '@zoonk/components/Meta';
import { GlobalContext } from '@zoonk/utils';

const ChapterEdit = dynamic(() => import('@zoonk/components/ChapterEdit'), {
  ssr: false,
});

const EditChapter: NextPage = () => {
  const { translate } = useContext(GlobalContext);

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('edit')} noIndex />
      <ChapterEdit />
    </Container>
  );
};

export default EditChapter;
