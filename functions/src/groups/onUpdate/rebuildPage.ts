import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { Group } from '@zoonk/models';

/**
 * Call a group page in the frontend to rebuild it (SSG).
 */
export const onUpdateGroupRebuildPage = functions.firestore
  .document('groups/{id}')
  .onUpdate((change) => {
    const { language } = change.after.data() as Group.Response;
    const url = `https://${language}.zoonk.org/groups/${change.after.id}`;
    return fetch(url);
  });
