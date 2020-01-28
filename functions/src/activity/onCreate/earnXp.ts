import * as functions from 'firebase-functions';
import { Activity } from '@zoonk/models';
import { earnXp } from '../../helpers';

export const onCreateActivityEarnXP = functions.firestore
  .document('activity/{editId}')
  .onCreate((snap) => {
    const data = snap.data() as Activity.Response;
    const xp =
      data.action === 'deleted' && data.createdById === data.before?.createdById
        ? -1
        : 1;
    return earnXp(data, xp);
  });
