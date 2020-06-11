import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Chapter, SnackbarAction } from '@zoonk/models';
import { deleteChapter, updateChapter } from '@zoonk/services';
import { firebaseError, GlobalContext } from '@zoonk/utils';
import ChapterForm from './ChapterForm';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface ChapterEditFormProps {
  data: Chapter.Get;
}

const ChapterEditForm = ({ data }: ChapterEditFormProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const isAuthor = user?.uid === data.createdById;
  const canDelete =
    user?.role === 'admin' || user?.role === 'moderator' || isAuthor;

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('chapter_delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      deleteChapter(data.id, profile, user.uid)
        .then(() => {
          setSnackbar(null);
          push('/topics/[id]', `/topics/${data.topics[0]}`);
        })
        .catch((e) => setSnackbar(firebaseError(e, 'chapter_delete')));
    }
  };

  const handleSubmit = (changes: Chapter.EditableFields) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    updateChapter(
      {
        ...changes,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      data.id,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'chapter_edit')));
  };

  return (
    <Fragment>
      <ChapterForm
        saving={snackbar?.type === 'progress'}
        data={data}
        onDelete={canDelete ? handleDelete : undefined}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default ChapterEditForm;
