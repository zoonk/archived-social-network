import * as functions from 'firebase-functions';
import { Activity, Post } from '@zoonk/models';
import { earnXp } from '../../helpers';
import { xpActions } from '../../settings';

type PostData = Post.Response | undefined;

export const onCreateActivityEarnXP = functions.firestore
  .document('activity/{editId}')
  .onCreate((snap) => {
    const data = snap.data() as Activity.Response;
    const isAuthor = data.createdById === data.before?.createdById;
    const xpAction = `${data.action}_${data.category}`;
    let xp: number = (xpActions as any)[xpAction] || 1;

    /**
     * When an item is removed by the author, then undo
     * the XP they earned by creating that item.
     */
    if (data.action === 'deleted' && isAuthor) {
      xp = -(xpActions as any)[`created_${data.category}`] || -1;
    }

    // Check if this activity has a `groupId`
    const fromGroup =
      (data.before as PostData)?.groupId || (data.after as PostData)?.groupId;

    return earnXp(data, xp, data.createdById, fromGroup);
  });
