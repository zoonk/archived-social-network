import { useRouter } from 'next/router';
import { timestamp } from '@zoonk/firebase/db';
import { Group } from '@zoonk/models';
import { deleteGroup, updateGroup } from '@zoonk/services';
import GroupForm from './GroupForm';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface GroupEditFormProps {
  data: Group.Get;
}

const GroupEditForm = ({ data }: GroupEditFormProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const canDelete =
    user?.role === 'admin' ||
    user?.role === 'moderator' ||
    data.createdById === user?.uid;

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      snackbar('progress', translate('deleting'));

      deleteGroup(data.id)
        .then(() => {
          snackbar('dismiss');
          push('/topics/[id]', `/topics/${data.topics[0]}`);
        })
        .catch((e) => snackbar('error', e.message));
    }
  };

  const handleSubmit = (changes: Group.EditableFields) => {
    snackbar('progress');

    updateGroup(
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
    <GroupForm
      saving={action === 'progress'}
      data={data}
      onDelete={canDelete ? handleDelete : undefined}
      onSubmit={handleSubmit}
    />
  );
};

export default GroupEditForm;
