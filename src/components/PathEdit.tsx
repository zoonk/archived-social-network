import { Fragment, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Path, SnackbarAction } from '@zoonk/models';
import { deletePath, updatePath } from '@zoonk/services';
import { firebaseError, GlobalContext, timestamp } from '@zoonk/utils';
import Snackbar from './Snackbar';
import PathForm from './PathForm';

interface PathEditProps {
  data: Path.Get;
}

/**
 * Component for editing a learning path.
 */
const PathEdit = ({ data }: PathEditProps) => {
  const { profile, translate, user } = useContext(GlobalContext);
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const canDelete = user?.role === 'admin' || user?.role === 'moderator';

  if (!user || !profile) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm(translate('delete_confirmation'))) {
      setSnackbar({ type: 'progress', msg: translate('deleting') });

      deletePath(data.id, profile, user.uid)
        .then(() => {
          setSnackbar(null);
          push('/topics/[id]', `/topics/${data.topics[0]}`);
        })
        .catch((e) => setSnackbar(firebaseError(e, 'path_delete')));
    }
  };

  const handleSubmit = (changes: Path.Fields, topics: string[]) => {
    setSnackbar({ type: 'progress', msg: translate('saving') });

    updatePath(
      {
        ...changes,
        topics,
        updatedAt: timestamp,
        updatedBy: profile,
        updatedById: user.uid,
      },
      data.id,
    )
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'path_edit')));
  };

  return (
    <Fragment>
      <PathForm
        saving={snackbar?.type === 'progress'}
        data={data}
        onSubmit={handleSubmit}
        onDelete={canDelete ? handleDelete : undefined}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PathEdit;
