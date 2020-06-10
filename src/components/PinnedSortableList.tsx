import { Fragment, useCallback, useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { timestamp } from '@zoonk/firebase/db';
import { Post, SnackbarAction } from '@zoonk/models';
import { getGroupLive, updatePost, updatePinOrder } from '@zoonk/services';
import { firebaseError, GlobalContext, theme } from '@zoonk/utils';
import Snackbar from './Snackbar';
import SortableList from './SortableList';
import useAuth from './useAuth';

interface GroupSortableListProps {
  groupId: string;
}

const PinnedSortableList = ({ groupId }: GroupSortableListProps) => {
  const { translate } = useContext(GlobalContext);
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const [snackbar, setSnackbar] = useState<SnackbarAction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Post.Summary[]>([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = getGroupLive(groupId, (snap) => {
      setItems(snap.pinnedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  const handleMove = useCallback(
    (drag: number, hover: number) => {
      const dragValue = items[drag];
      const newOrder = [...items];
      newOrder.splice(drag, 1);
      newOrder.splice(hover, 0, dragValue);
      setItems(newOrder);
    },
    [items],
  );

  if (!user || !profile) {
    return null;
  }

  if (loading) {
    return <CircularProgress />;
  }

  const save = () => {
    setSnackbar({ type: 'progress', msg: translate('saving') });
    const changes = items.map((item) => item.id);
    updatePinOrder(changes, groupId, profile, user.uid)
      .then(() => setSnackbar({ type: 'success', msg: translate('saved') }))
      .catch((e) => setSnackbar(firebaseError(e, 'update_order')));
  };

  const remove = (id: string) => {
    setSnackbar({ type: 'progress', msg: translate('pin_removing') });

    const changes = {
      pinned: false,
      updatedAt: timestamp,
      updatedBy: profile,
      updatedById: user.uid,
    };

    updatePost(changes, id)
      .then(() => {
        setItems((previous) => {
          const newItems = previous.filter((post) => post.id !== id);
          return newItems;
        });
        setSnackbar({ type: 'success', msg: translate('pin_removed') });
      })
      .catch((e) => setSnackbar(firebaseError(e, 'pin_remove')));
  };

  return (
    <Fragment>
      <div style={{ display: 'flex' }}>
        <NextLink href={`/posts/add?groupId=${groupId}&pinned=true`} passHref>
          <Button component="a" size="small" color="primary">
            <Add
              aria-label={translate('post_pinned_add')}
              style={{ marginRight: theme.spacing(0.5) }}
            />
            {translate('post_pinned_add')}
          </Button>
        </NextLink>
      </div>
      <SortableList
        category="posts"
        items={items}
        saving={snackbar?.type === 'progress'}
        onCancel={() => push('/groups/[id]', `/groups/${groupId}`)}
        onDelete={remove}
        onMove={handleMove}
        onSave={save}
      />
      <Snackbar action={snackbar} />
    </Fragment>
  );
};

export default PinnedSortableList;
