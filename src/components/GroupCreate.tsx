import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Group, SnackbarAction } from '@zoonk/models';
import { createGroup } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import GroupForm from './GroupForm';
import Snackbar from './Snackbar';

const GroupCreate = () => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push, query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const { topicId } = query;

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = async (data: Group.EditableFields, topics: string[]) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createGroup({
      ...data,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      language: appLanguage,
      likes: 0,
      members: 0,
      pinned: [],
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        push('/groups/[id]', `/groups/${id}`);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'group_add')));
  };

  return (
    <Fragment>
      <GroupForm
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        topicIds={topicId ? [String(topicId)] : undefined}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default GroupCreate;
