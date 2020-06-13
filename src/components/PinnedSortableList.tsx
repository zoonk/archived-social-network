import { Fragment, useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, CircularProgress } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { timestamp } from '@zoonk/firebase/db';
import { Post } from '@zoonk/models';
import { getGroupLive, updatePost, updatePinOrder } from '@zoonk/services';
import { theme } from '@zoonk/utils';
import SortableList from './SortableList';
import useAuth from './useAuth';
import useSnackbar from './useSnackbar';
import useTranslation from './useTranslation';

interface GroupSortableListProps {
  groupId: string;
}

const PinnedSortableList = ({ groupId }: GroupSortableListProps) => {
  const translate = useTranslation();
  const { profile, user } = useAuth();
  const { push } = useRouter();
  const { action, snackbar } = useSnackbar();
  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<Post.Summary[]>([]);

  useEffect(() => {
    const unsubscribe = getGroupLive(groupId, (snap) => {
      setLoading(false);
      if (!snap) return;
      setItems(snap.pinnedPosts);
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
    snackbar('progress');
    const changes = items.map((item) => item.id);
    updatePinOrder(changes, groupId, profile, user.uid)
      .then(() => snackbar('success'))
      .catch((e) => snackbar('error', e.message));
  };

  const remove = (id: string) => {
    snackbar('progress', translate('pin_removing'));

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
        snackbar('success', translate('pin_removed'));
      })
      .catch((e) => snackbar('error', e.message));
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
        saving={action === 'progress'}
        onCancel={() => push('/groups/[id]', `/groups/${groupId}`)}
        onDelete={remove}
        onMove={handleMove}
        onSave={save}
      />
    </Fragment>
  );
};

export default PinnedSortableList;
