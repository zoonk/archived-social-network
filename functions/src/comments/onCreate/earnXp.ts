import * as functions from 'firebase-functions';
import { Comment } from '@zoonk/models';
import { earnXp } from '../../helpers';
import { xpActions } from '../../settings';

export const onCreateCommentEarnXP = functions.firestore
  .document('comments/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Comment.Response;
    return earnXp(
      data,
      xpActions.created_comments,
      data.createdById,
      data.groupId,
    );
  });
