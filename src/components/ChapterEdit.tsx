import { Fragment, useContext, useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import ChapterEditForm from '@zoonk/components/ChapterEditForm';
import ChapterFormContainer from '@zoonk/components/ChapterFormContainer';
import ChaptersBreadcrumb from '@zoonk/components/ChaptersBreadcrumb';
import Snackbar from '@zoonk/components/Snackbar';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';

interface ChapterEditProps {
  id: string;
}

const ChapterEdit = ({ id }: ChapterEditProps) => {
  const { translate } = useContext(GlobalContext);
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [data, setData] = useState<Chapter.Get | null | undefined>();

  useEffect(() => {
    getChapter(id)
      .then(setData)
      .catch((e) => setSnackbar(firebaseError(e, 'chapter_get')));
  }, [id]);

  if (data === undefined) return <CircularProgress />;
  if (data === null) return <Error statusCode={404} />;

  return (
    <Fragment>
      <ChaptersBreadcrumb
        chapterId={data.id}
        topicId={data.topics[0]}
        title={data.title}
        page={translate('edit')}
      />
      <ChapterFormContainer>
        <ChapterEditForm data={data} />
      </ChapterFormContainer>
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default ChapterEdit;
