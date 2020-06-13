import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Chapter } from '@zoonk/models';
import { createChapter } from '@zoonk/services';
import { appLanguage } from '@zoonk/utils';
import ChapterForm from './ChapterForm';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';

interface ChapterCreateProps {
  topicId: string;
}

const ChapterCreate = ({ topicId }: ChapterCreateProps) => {
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (data: Chapter.EditableFields) => {
    snackbar('progress');

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
        snackbar('success');
        push('/chapters/[id]', `/chapters/${id}`);
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <ChapterForm
      saving={action === 'progress' || action === 'success'}
      onSubmit={handleSubmit}
    />
  );
};

export default ChapterCreate;
