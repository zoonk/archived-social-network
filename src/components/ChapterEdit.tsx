import { Fragment, useEffect, useState } from 'react';
import Error from 'next/error';
import { CircularProgress } from '@material-ui/core';
import { Chapter } from '@zoonk/models';
import { getChapter } from '@zoonk/services';
import ChapterEditForm from './ChapterEditForm';
import ChapterFormContainer from './ChapterFormContainer';
import ChaptersBreadcrumb from './ChaptersBreadcrumb';
import useTranslation from './useTranslation';

interface ChapterEditProps {
  id: string;
}

const ChapterEdit = ({ id }: ChapterEditProps) => {
  const translate = useTranslation();
  const [data, setData] = useState<Chapter.Get | null | undefined>();

  useEffect(() => {
    getChapter(id)
      .then(setData)
      .catch(() => setData(null));
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
    </Fragment>
  );
};

export default ChapterEdit;
