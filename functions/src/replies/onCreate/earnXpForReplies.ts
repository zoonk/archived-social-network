import * as functions from 'firebase-functions';
import { Reply } from '@zoonk/models';
import { earnXp } from '../../helpers';

export const onCreateReplyEarnXP = functions.firestore
  .document('replies/{id}')
  .onCreate((snap) => {
    const data = snap.data() as Reply.Response;
    return earnXp(data);
  });
