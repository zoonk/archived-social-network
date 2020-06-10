import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Group, SnackbarAction } from '@zoonk/models';
import { deleteGroup, updateGroup } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import GroupForm from './GroupForm';
import Snackbar from './Snackbar';
import useAuth from './useAuth';

interface GroupEditProps {
  data: Group.Get;
}

const GroupEdit = ({ data }: GroupEditProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const canDelete =
    user?.role === 'admin' ||
    user?.role === 'moderator' ||
    data.createdById === user?.uid;

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      deleteGroup(data.id)
        .then(() => {
          setSnackbar(null);
          push('/topics/[id]', `/topics/${data.topics[0]}`);
        })
        .catch((e) => setSnackbar(firebaseError(e, 'groups_delete')));
    }
  };

  const handleSubmit = (changes: Group.EditableFields) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    updateGroup(
      {
        ...changes,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      data.id,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'group_edit')));
  };

  return (
    <Fragment>
      <GroupForm
        saving={snackbar?.type === 'progress'}
        data={data}
        onDelete={canDelete ? handleDelete : undefined}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default GroupEdit;
