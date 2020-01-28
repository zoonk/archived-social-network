import * as functions from 'firebase-functions';
import { Comment } from '@zoonk/models';
import { earnXp } from '../../helpers';

export const onCreateCommentEarnXP = functions.firestore
  .document('comments/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Comment.Response;
    return earnXp(data);
  });
