import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Path, SnackbarAction } from '@zoonk/models';
import { createPath } from '@zoonk/services';
import {
  appLanguage,
  firebaseError,
  GlobalContext,
  timestamp,
} from '@zoonk/utils';
import Snackbar from './Snackbar';
import PathForm from './PathForm';

/**
 * Component for creating a learning path.
 */
const PathCreate = () => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push, query } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const topicId = query.topicId ? String(query.topicId) : undefined;

  if (!user || !profile) {
    return null;
  }

  const handleSubmit = (data: Path.Fields, topics: string[]) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    createPath({
      ...data,
      comments: 0,
      createdAt: timestamp,
      createdBy: profile,
      createdById: user.uid,
      language: appLanguage,
      likes: 0,
      topics,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    })
      .then((id) => {
        setSnackbar({ type: 'success', msg: translate('saved') });
        push('/paths/[id]', `/paths/${id}`);
      })
      .catch((e) => setSnackbar(firebaseError(e, 'padd_add')));
  };

  return (
    <Fragment>
      <PathForm
        saving={snackbar?.type === 'progress' || snackbar?.type === 'success'}
        topicId={topicId}
        onSubmit={handleSubmit}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PathCreate;
