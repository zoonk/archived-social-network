import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { CircularProgress, Container } from '@material-ui/core';
import ChapterEdit from '@zoonk/components/ChapterEdit';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import LinkChapter from '@zoonk/components/LinkChapter';
import Meta from '@zoonk/components/Meta';
import Snackbar from '@zoonk/components/Snackbar';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import { analytics, firebaseError, GlobalContext } from '@zoonk/utils';

const EditChapter: NextPage = () => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [data, setData] = useState<Chapter.Get>();
  const { query } = useRouter();

  useEffect(() => {
    analytics().setCurrentScreen('chapter_edit');
  }, []);

  useEffect(() => {
    if (query.id) {
      getChapter(String(query.id))
        .then(setData)
        .catch((e) => setSnackbar(firebaseError(e, 'chapter_get')));
    }
  }, [query.id]);

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Meta title={translate('edit')} />

      <ChaptersBreadcrumb pathId={data.pathId} title={translate('edit')}>
        <LinkChapter title={data.title} id={data.id} />
      </ChaptersBreadcrumb>

      <ChapterFormContainer>
        <ChapterEdit data={data} />
      </ChapterFormContainer>

      <Snackbar action={snackbar} />
    </Container>
  );
};

export default EditChapter;
