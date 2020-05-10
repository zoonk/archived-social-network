import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { createChapter } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import ChapterForm from './ChapterForm';
import Snackbar from './Snackbar';

interface ChapterCreateProps {
  topicId: string;
}

const ChapterCreate = ({ topicId }: ChapterCreateProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (data: Chapter.EditableFields) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createChapter({
      ...data,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      examples: [],
      language: appLanguage,
      lessons: [],
      likes: 0,
      topics: [topicId],
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        push('/chapters/[id]', `/chapters/${id}`);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'chapter_add')));
  };

  return (
    <Fragment>
      <ChapterForm
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default ChapterCreate;
