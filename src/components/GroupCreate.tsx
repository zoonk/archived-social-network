import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Group } from '@zoonk/models';
import { createGroup } from '@zoonk/services';
import { appLanguage } from '@zoonk/utils';
import GroupForm from './GroupForm';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';

const GroupCreate = () => {
  const { profile, user } = useAuth();
  const { push, query } = useRouter();
  const { action, snackbar } = useSnackbar();
  const { topicId } = query;

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (data: Group.EditableFields, topics: string[]) => {
    snackbar('progress');

    createGroup({
      ...data,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      followers: 0,
      language: appLanguage,
      likes: 0,
      pinned: [],
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        snackbar('success');
        push('/groups/[id]', `/groups/${id}`);
      })
      .catch((e) => snackbar('error', e.message));
  };

  return (
    <GroupForm
      saving={action === 'progress' || action === 'success'}
      topicIds={topicId ? [String(topicId)] : undefined}
      onSubmit={handleSubmit}
    />
  );
};

export default GroupCreate;
