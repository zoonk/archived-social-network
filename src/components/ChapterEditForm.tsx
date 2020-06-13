import { Fragment } from 'react';
import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Chapter } from '@zoonk/models';
import { deleteChapter, updateChapter } from '@zoonk/services';
import ChapterForm from './ChapterForm';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface ChapterEditFormProps {
  data: Chapter.Get;
}

const ChapterEditForm = ({ data }: ChapterEditFormProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const isAuthor = user?.uid === data.createdById;
  const canDelete =
    user?.role === 'admin' || user?.role === 'moderator' || isAuthor;

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('chapter_delete_confirmation'))) {
      snackbar('progress', translate('deleting'));

      deleteChapter(data.id, profile, user.uid)
        .then(() => {
          snackbar('dismiss');
          push('/topics/[id]', `/topics/${data.topics[0]}`);
        })
        .catch((e) => snackbar('error', e.message));
    }
  };

  const handleSubmit = (changes: Chapter.EditableFields) => {
    snackbar('progress');

    updateChapter(
      {
        ...changes,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      data.id,
    )
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <Fragment>
      <ChapterForm
        saving={action === 'progress'}
        data={data}
        onDelete={canDelete ? handleDelete : undefined}
        onSubmit={handleSubmit}
      />
    </Fragment>
  );
};

export default ChapterEditForm;
