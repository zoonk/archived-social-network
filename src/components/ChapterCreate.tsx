import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { createChapter, getPath } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import ChapterForm from './ChapterForm';
import Snackbar from './Snackbar';

interface ChapterCreateProps {
  pathId: string;
}

/**
 * Component for creating a chapter.
 */
const ChapterCreate = ({ pathId }: ChapterCreateProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { query, push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (data: Omit<Chapter.EditableFields, 'order'>) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    // Get the current path data the topics list.
    const path = await getPath(pathId);

    createChapter({
      ...data,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      examples: 0,
      language: appLanguage,
      lessons: 0,
      likes: 0,
      order: query.order ? Number(query.order) : 1,
      pathId,
      posts: 0,
      topics: path.topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        push('/chapters/[id]', `/chapters/${id}`);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'path_add')));
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
